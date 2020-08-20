const mongoose = require('mongoose');
const Joi = require('joi');

const friendSchema = new mongoose.Schema({
    User_id: { type: Number, required: true},
    Online: { type: Boolean, required: true},
    FriendStatus: { type: String, required: true}
})