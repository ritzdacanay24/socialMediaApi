const mongoose = require('mongoose');
const Joi = require('joi');

const friendSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    requestedBy: { type: String, required: true },
    online: { type: Boolean, required: true },
    friendStatus: { type: String, required: true }
})

const FriendStatus = mongoose.model('Friends', friendSchema);

function validateFriend(product) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        requestedBy: Joi.string().required(),
        online: Joi.boolean().required(),
        friendStatus: Joi.string().required(),

    });
    return schema.validate(product);
}

exports.FriendStatus = FriendStatus;
exports.validate = validateFriend;
exports.friendSchema = friendSchema;



