const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// error handling : we are putting our entire function inside the catchAsync function

// index/homepage
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));


// adding new campground (2 step procedure)
// Step 1 : Render the form
// using isLoggedIn middleware to protect certain routes, like this one
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});
// Step 2 : Post data from the form
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    // req.user is provided to us by passport
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));


// details of a particular camp
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    // by using populate, we are actually fetching data by the references present in our model
    // Here, we actually have to populate two "authors", one populate is for the author of the campground, other is the author of the review
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        },
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Campground not found!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/details', { campground });
}));


// updating a campground (again a 2 step procedure)
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// deleting a campground
router.delete('/:id', isAuthor, isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));


// exporting router
module.exports = router;