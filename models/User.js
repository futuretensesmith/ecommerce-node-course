const mongoose = require('mongoose');

// instead of using regEx match  to validate the email input
// we are using the validator package applying the isEmail validator.
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name.'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        unique: true, // technically is not a validator. good for development
        required: [true, 'Please provide email.'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email.'
        }

    },
    password: {
        type: String,
        required: [true, 'Please provide correct password'],
        minLength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
})

// before we save the document we will hash the password.
// we add -- function -- keyword so the at we can use -- this -- keyword
// which will refer to the user. With arrow functions that would not be the case.
UserSchema.pre('save', async function () {
    // console.log(this.modifiedPaths());
    // console.log(this.isModified('name'));
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch
}
module.exports = mongoose.model('User', UserSchema);