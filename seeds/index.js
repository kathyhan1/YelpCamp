
const mongoose= require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db= mongoose.connection 
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",()=> {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
   for(let i = 0; i <50; i++ ){
   const random307 = Math.floor(Math.random() * 307);
const price= Math.floor(Math.random()*20) +10;
   const camp= new Campground ({ 
    author: '62c736d3ef77af581463f241',
        location: `${cities[random307].city}, ${cities[random307].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        //image: "https://placeimg.com/640/480/nature",
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque unde explicabo iure quas praesentium quidem sequi temporibus fugiat officia, vitae accusamus iusto harum neque facere labore esse quis ad dicta.",
        price,
        images : [
            {
              url: 'https://res.cloudinary.com/dl9wkcgau/image/upload/v1657814826/YelpCampK/vuhxzk3tzbqs1ttxz0nd.jpg',
              filename: 'YelpCampK/vuhxzk3tzbqs1ttxz0nd',
    },
    {
              url: 'https://res.cloudinary.com/dl9wkcgau/image/upload/v1657814827/YelpCampK/hwhvwegfw2nfqvvf1qym.jpg',
              filename: 'YelpCampK/hwhvwegfw2nfqvvf1qym',
            }
          ],
    })   
   await camp.save();
}
}
seedDB().then(() => {
mongoose.connection.close();
})