const express = require('express');
// we are setting mergeParams : true as by default, the reviews router does not have access to the id  passed by app.js
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');


// post request for adding reviews to a particular camp
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// deleting reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;