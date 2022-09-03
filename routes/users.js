const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        // we create a user without the password attribute
        const user = new User({ email, username });
        // we pass on the password while registering the user, all this is because of passport.js, that is how it works
        const registeredUser = await User.register(user, password);
        // when a user registers, automatically log him in using req.login method provided by passport
        req.login(registeredUser, err => {
            // weird syntax that you just have to deal with
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

// here we are using a middleware provided to us by passport.js
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}!`);
    // checking if the user was trying to access any url before logging In.
    // if the user wasn't trying to go anywhere and was simply logging In, redirect to the default "/campgrounds" page
    // FIXME : Fix the returnTo problem
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// logout route
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out successfully!');
        res.redirect('/campgrounds');
    });
});

module.exports = router;