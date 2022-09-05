const Campground = require('../models/campground');


// NOTE : we are using controllers purely as a clean-up method to make the code more simpler and understandable 
// routers have too many routes, those routes have too many lines of code, it becomes messy and hard to understand
// so we are moving the functionality of the routes to a seperate "controller", which the route will later import
// we then simply pass on the functionality in an object as a function for implementing the logic



// since the routes were getting crowded with lots of lines of code which is basically just representing a function
// we are now moving the functions and writing the logic here, then we will simply provide an object to the routes which will contain the methods required for implementing the logic of that particular route
// for example, here we are defining a function which will display all campgrounds, by the name of "index"

// rendering index page containing all campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

// rendering form for new campground
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

// creating new campground
module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    // req.user is provided to us by passport
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

// showing details of a particular campground
module.exports.showCampground = async (req, res) => {
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
}

// rendering edit form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}

// updating campground
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

// deleting a campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}