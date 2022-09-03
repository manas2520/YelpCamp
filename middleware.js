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