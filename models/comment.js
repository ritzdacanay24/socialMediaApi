const mongoose = require('mongoose');
const Joi = require('joi');

const replySchema = new mongoose.Schema({
    comment: { type: String, required: true },
    likes: { type: Number, required: false },
    dislikes: { type: Number, required: false }
});

const ReplyComment = mongoose.model('ReplyComment', replySchema);

const commentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    comment: { type: String, required: true },
    likes: { type: Number, required: false },
    dislikes: { type: Number, required: false },
    replies: { type: [replySchema], default: [] },
});
const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        comment: Joi.string().required(),
        likes: Joi.number(),
        dislikes: Joi.number()
    });
    return schema.validate(comment);
}

function validateReply(comment) {
    const schema = Joi.object({
        comment: Joi.string().required(),
        likes: Joi.number(),
        dislikes: Joi.number()
    });
    return schema.validate(comment);
}
exports.Comment = Comment;
exports.ReplyComment = ReplyComment;
exports.validate = validateComment;
exports.validateReply = validateReply;
exports.commentSchema = commentSchema;