const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    comment: { type: String, required: true },
    likes: { type: Number, required: false, default: 0 },
    dislikes: { type: Number, required: false, default: 0 },
    createdDate: { type: Date, required: true, default: Date }
});
const Post = mongoose.model('Posts', postSchema);

function validatePost(post) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        comment: Joi.string().required(),
        likes: Joi.number(),
        dislikes: Joi.number()
    });
    return schema.validate(post);
}

exports.Post = Post;
exports.validatePost = validatePost;
exports.postSchema = postSchema;