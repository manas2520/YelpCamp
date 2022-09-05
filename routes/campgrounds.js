const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// error handling : we are putting our entire function inside the catchAsync function

// index/homepage
// using the method "index" provided to us by the campgrounds controller
router.get('/', catchAsync(campgrounds.index));


// adding new campground (2 step procedure)
// Step 1 : Render the form
// using isLoggedIn middleware to protect certain routes, like this one
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
// Step 2 : Post data from the form
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));


// details of a particular camp
router.get('/:id', catchAsync(campgrounds.showCampground));

// updating a campground (again a 2 step procedure)
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// deleting a campground
router.delete('/:id', isAuthor, isLoggedIn, catchAsync(campgrounds.deleteCampground));

// exporting router
module.exports = router;