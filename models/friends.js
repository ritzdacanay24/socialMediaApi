const mongoose = require('mongoose');
const Joi = require('joi');

const friendSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    requestedBy: { type: Number, required: true },
    online: { type: Boolean, required: true },
    friendStatus: { type: String, required: true }
})

const FriendStatus = mongoose.model('Friends', friendSchema);

function validateFriend(product) {
    const schema = Joi.object({
        userId: Joi.number().required(),
        requestedBy: Joi.number().required(),
        online: Joi.boolean().required(),
        friendStatus: Joi.string().required(),

    });
    return schema.validate(product);
}

exports.FriendStatus = FriendStatus;
exports.validate = validateFriend;
exports.friendSchema = friendSchema;



