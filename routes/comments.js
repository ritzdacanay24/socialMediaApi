const { Comment, validate, ReplyComment, validateReply } = require('../models/comment');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(error);

        // Need to validate body before continuing
        const comment = new Comment({
            userId: req.body.userId,
            comment: req.body.comment,
            likes: req.body.likes,
            dislikes: req.body.dislikes
        });
        await comment.save();
        return res.send(comment);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/replyComment/:commentId', async (req, res) => {
    try {

        const { error } = validateReply(req.body);
        if (error)
            return res.status(400).send(error);
            
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(400).send(`The comment with id "${req.params.commentId}" does not exist.`);
        const commentInfo = {
            comment: req.body.comment,
            likes: req.body.likes,
            dislikes: req.body.dislikes
        }
        new ReplyComment(commentInfo);

        comment.replies.push(commentInfo);
        await comment.save();
        return res.send(comment);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/:youtubeId', async (req, res) => {
    try {

        const comments = await Comment.find({ 'youtubeId': req.params.youtubeId });
        
        if (!comments)
            return res.status(400).send(`The youtube video with id "${req.params.id}" does not exist.`);
        return res.send(comments);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error);
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                youtubeId: req.body.youtubeId,
                comment: req.body.comment,
                likes: req.body.likes,
                dislikes: req.body.dislikes,
            },
            { new: true }
        );
        if (!comment)
            return res.status(400).send(`The product with id "${req.params.id}" does not exist.`);
        await comment.save();
        return res.send(comment);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        return res.send(comments);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;