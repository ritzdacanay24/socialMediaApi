const mongoose = require('mongoose');
const Joi = require('joi');


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: {type: String, required: true },
    email: {type: String, unique: true, required: true },
    password: {type: String, minlength: 6, required: true},
    timeStamp: {type: Date, timeStamp: true,},
    profileImage: {type: String}
})

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required().min(6),
    timeStamp: Joi.date(), 
    profileImage: Joi.string()
    

    });
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;