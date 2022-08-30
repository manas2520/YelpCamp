const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

// passportLocalMongoose automatically adds username and passport field to userSchema
userSchema.plugin(passportLocalMongoose);

// compiling User model
const User = mongoose.model('User', userSchema);

// exporting User model
module.exports = User;