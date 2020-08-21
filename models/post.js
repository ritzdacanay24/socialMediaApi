const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    comment: { type: String, required: true },
    likes: { type: Number, required: false },
    dislikes: { type: Number, required: false }
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