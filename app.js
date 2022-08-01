if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET)
console.log(process.env.API_KEY)

const express= require('express');
const app = express();
const path= require('path');
const mongoose= require('mongoose');
const ejsMate = require('ejs-mate');

const session= require('express-session');
const flash= require('connect-flash');
const ExpressError= require('./utils/ExpressError');
const methodOverride= require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet= require('helmet');

const mongoSanitize = require('express-mongo-sanitize')

const userRoutes = require('./routes/users')
const campgroundsRoutes= require('./routes/campgrounds')
const reviewsRoutes= require('./routes/reviews')
const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl,{ 
});

const db= mongoose.connection; 
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",()=> {
    console.log("Database connected");
});

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize({
    replaceWith:'_'
}));

const secret = process.env.SECRET || 'thisshouldbeaettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
        //secret: 'squirrel',
    }
});

store.on("error", function (e) {
    console.log("session store error", e)
})

const sessionConfig = {
    store, 
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now()+ 1000 * 60 *60 *24 * 7,
        maxAge: 1000 * 60 *60 *24 * 7,
    }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dl9wkcgau/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dl9wkcgau/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dl9wkcgau/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dl9wkcgau/" ];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dl9wkcgau/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
                //"https://random.imagecdn.app/500/150", this didnt work on home.ejs
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dl9wkcgau/" ],
            childSrc   : [ "blob:" ]
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success= req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
//we use this path so we can take it out of our route/reviews path. 

app.get('/', (req,res)=> {
  res.render('home')
});




app.all('*',(req,res,next) => {
    next(new ExpressError('Page not found!', 404))
});

app.use((err, req, res, next) => {
    const {statusCode= 500, message= 'Something went wrong'} = err;
    if(!err.message) err.message = 'Oh No, something went wrong!'
    res.status(statusCode).render('error',{err});
    console.log("Oh boy, something is wrong.");
    console.log(err);
});

app.listen(3000,() => {
    console.log('listening on port 3000, working')
})