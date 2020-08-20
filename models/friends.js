const mongoose = require('mongoose');
const Joi = require('joi');

const friendSchema = new mongoose.Schema({
    User_id: { type: Number, required: true },
    Requested_by:{type: Number, required: true},
    Online: { type: Boolean, required: true },
    FriendStatus: { type: String, required: true }
})

const FriendStatus = mongoose.model('FriendStatus', friendSchema);


function validateFriend(product) {
    const schema = Joi.object({
        User_id: Joi.string().required(),
        Online: Joi.boolean().required(),
        FriendStatus: Joi.string().required(),
        Request_by: Joi.number().required(),
    });
    return schema.validate(product);
}

exports.FriendStatus = FriendStatus;
exports.validate = validateFriend;
exports.friendSchema = friendSchema;



