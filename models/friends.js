const mongoose = require('mongoose');
const Joi = require('joi');

const friendSchema = new mongoose.Schema({
    User_id: { type: Number, required: true},
    Online: { type: Boolean, required: true},
    FriendStatus: { type: String, required: true}
})

const FriendStatus - mongoose.model('FriendStatus',friendSchema);

exports.FriendStatus=FriendStatus;
exports.friendSchema=friendSchema;