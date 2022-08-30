const mongoose = require('mongoose');
// here we are making a reference to the Schema so that we can easily refer to it again and again
const Schema = mongoose.Schema;
const Review = require('./review');

// Designing the schema
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews: [
        {
            // the type here is of Object Id, something not native in js, so we have to explicitly define it
            type: Schema.Types.ObjectId,
            // specifing that the above mentioned Object Id is from Review model
            ref: 'Review',
        }
    ],
});

// Middleware stuff
// Whenever we use the Campground.findByIdAndDelete(), it triggers the middleware findOneAndDelete, so if we want anything happening after the deletion of a campground, we have to use the above mentioned middleware.
// Specifically, the 'post' middleware, as we want to delete the reviews associated with a campground after the campground itself has been deleted. 
// Using the post middleware gives us access to the object we just deleted, so we can do whatever we want with it(deleting reviews)
// Also, below mentioned middleware is a query middleware
campgroundSchema.post('findOneAndDelete', async function (doc) {
    // If we found a document and deleted it, only then execute the below code
    if (doc) {
        await Review.deleteMany({
            _id: {
                // remove all reviews that are present in the reviews array of the deleted doc
                $in: doc.reviews
            }
        });
    }
});

// Ordering is very important. If the Campground model is created before the middleware, the middleware will not trigger

// Creating the model from schema
const Campground = mongoose.model('Campground', campgroundSchema);

// Exporting the model
module.exports = Campground;