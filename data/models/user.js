// database model for User
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// creating user schema using mongoose
var userSchema = mongoose.Schema({
    username: {type: String, unique: true},
    password: String
});

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// performing require(user.js) will return the userSchema object
module.exports = mongoose.model('User', userSchema);