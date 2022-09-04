const ExpressError = require('./utils/ExpressError');
// using joi schema for validations
const { campgroundSchema, reviewSchema } = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');

// creating a middleware function to check if a user is loggedIn or not
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // storing the original url the user meant to access despite not being loggedIn. 
        // Once the user logs in, redirect to the path where user was previously trying to go instead of redirecting to campgrounds
        // here, "returnTo" is an arbitrary name being stored as key in the session. You could have named it "bhrooshwasoo" or "stupidUser".
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be loggedIn to perform this action');
        // adding return is preferred if using middleware
        return res.redirect('/login');
    }
    // DON'T FORGET TO CALL "NEXT" IN A MIDDLEWARE FUNCTION
    next();
}

// middleware function for validating using Joi schema data
module.exports.validateCampground = (req, res, next) => {
    // validating req.body
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        // el : for each element
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


// middleware to check if the current user is the author of a campground or not
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorised to perform this action');
        // return is preferred in middleware functions to avoid even accidently somehow moving on to the next line, as it will break the middleware
        // return ensure the end of the function
        return res.redirect(`/campgrounds/${id}`);
    }
    // Do not forget to put next in middleware functions
    next();
}


// middleware to check if the current user is the author of a review in a campground or not
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorised to perform this action');
        // return is preferred in middleware functions to avoid even accidently somehow moving on to the next line, as it will break the middleware
        // return ensure the end of the function
        return res.redirect(`/campgrounds/${id}`);
    }
    // Do not forget to put next in middleware functions
    next();
}

// middleware for validating whether review is valid or not
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}