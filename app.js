const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const campgroundRoutes = require('./routes/campgrounds');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

// establishing mongoose connection
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoose connection error : '));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// command to parse object bodies of post request
app.use(express.urlencoded({ extended: true }));
// command used to implement methods like patch,delete,put as the form can only submit GET and POST requests
app.use(methodOverride('_method'));
// telling express to serve the public directory
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisisaverypoorsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // httpOnly : true strengthens the security of our cookies
        httpOnly: true,
        // this huge number is 1 week expressed in milliseconds
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
// using sessions
app.use(session(sessionConfig));

// using flash for flash messages
app.use(flash());

// passport.js (authorization stuff)
app.use(passport.initialize());
// passport.session() is required for persistent login sessions
// MAKE SURE THIS IS BEING USED AFTER SESSION SETUP (app.use(session()))
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// serializing a user refers to how are we storing the user in the session
passport.serializeUser(User.serializeUser());
// deserializing means how to un-store a user in the session
passport.deserializeUser(User.deserializeUser());

// setting up middleware for flash messages
app.use((req, res, next) => {
    // this fetches us current user from the session. This is handled by passport.js
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // NEVER FORGET TO CALL NEXT WHILE USING MIDDLEWARE!!!
    next();
});


// using routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// error handling

// if no route matches
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

// catching errors
app.use((err, req, res, next) => {
    // here we are destructuring/extracting status code from the error caught
    // we can also define a default value for status code, as demonstrated below
    const { statusCode = 500 } = err;
    if (!err.message)
        // setting the default error message
        err.message = 'Oh no, something went wrong';
    res.status(statusCode).render('error', { err });
});


// listening port
app.listen('3000', () => {
    console.log('Listening on port 3000 : ');
});


