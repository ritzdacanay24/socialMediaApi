const mongoose = require('mongoose');
const Joi = require('joi');

const friendSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    requestedBy: { type: String, required: true },
    friendStatus: { type: String, required: true, enum: ['Pending', 'Confirmed'], default: 'Pending' }
})

const FriendStatus = mongoose.model('Friends', friendSchema);

function validateFriend(product) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        requestedBy: Joi.string().required(),
        friendStatus: Joi.string().required().valid('Pending', 'Confirmed'),
    });
    return schema.validate(product);
}

exports.FriendStatus = FriendStatus;
exports.validate = validateFriend;
exports.friendSchema = friendSchema;



