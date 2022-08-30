const express = require('express');
// we are setting mergeParams : true as by default, the reviews router does not have access to the id  passed by app.js
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
// joi schema
const { reviewSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');


// middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


// post request for adding reviews to a particular camp
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // we use req.body.review as everything in the ejs file is done in the format review[x]
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// deleting reviews
router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // below mentioned command pulls the review with id as reviewId
    // here we are actually removing the reviewId in the reviews array present in the campground
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // here we are deleting the actual review
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;