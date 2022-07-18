const express= require('express');
const router= express.Router({mergeParams:true});
const {validateReview, isLoggedIn, isReviewAuthor}= require('../middleware')
const catchAsync = require ('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError= require('../utils/ExpressError');

//this is to validate reviews so someone can't post thourgh Ajax or postman. 


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;