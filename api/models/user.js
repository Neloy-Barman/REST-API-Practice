const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        // unique doesn't check if an email address is on the database or not. 
        // It optimizes the field to be searched or does performance optimization. 
        unique: true,
        // match takes a regular expression as its input to check valid type of  string
        match: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
    },
    password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);