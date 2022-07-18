const express = require('express');
const router= express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require ('../utils/catchAsync'); //we use dot dot to go back another folder path.
//const ExpressError= require('../utils/ExpressError'); took out cause not using in this file
const Campground = require('../models/campground');
const methodOverride= require('method-override');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

const { model } = require("mongoose");



router.route ('/')
    .get(catchAsync(campgrounds.index ))
    .post(isLoggedIn,  upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
   


  router.get('/new', isLoggedIn, campgrounds.renderNewForm);
  
 
  //i want to leave the bottom the way it is so I can see the different options in how to do it. 
  router.get('/:id', catchAsync (campgrounds.showCampground));
  
  router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync (campgrounds.renderEditForm));
  
  router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync (campgrounds.updateCampground));
  
  router.delete('/:id', isLoggedIn, isAuthor, catchAsync (campgrounds.deleteCampground));

  module.exports = router; 