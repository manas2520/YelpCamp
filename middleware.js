// creating a middleware function to check if a user is loggedIn or not
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be loggedIn to perform this action');
        // adding return is preferred if using middleware
        return res.redirect('/login');
    }
    // DON'T FORGET TO CALL "NEXT" IN A MIDDLEWARE FUNCTION
    next();
}