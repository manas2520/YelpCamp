const mongoose = require('mongoose');
// here we are making a reference to the Schema so that we can easily refer to it again and again
const Schema = mongoose.Schema;

// creating review schema
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        // reference to the type 'User' model 
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

// creating review model
const Review = mongoose.model('Review', reviewSchema);

// exporting review model
module.exports = Review;