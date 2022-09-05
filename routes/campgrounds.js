const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// error handling : we are putting our entire function inside the catchAsync function

router.route('/')
    // index/homepage
    // using the method "index" provided to us by the campgrounds controller
    .get(catchAsync(campgrounds.index))
    // posting data for new campground
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));


// using isLoggedIn middleware to protect certain routes, like this one
// render login form
router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
    // details of a particular camp
    .get(catchAsync(campgrounds.showCampground))
    // updating a campground
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    // deleting a campground
    .delete(isAuthor, isLoggedIn, catchAsync(campgrounds.deleteCampground));


// render edit form for campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// exporting router
module.exports = router;