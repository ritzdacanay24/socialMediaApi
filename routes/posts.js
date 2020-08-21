const { Post, validatePost} = require('../models/post');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { error } = validatePost(req.body);
        if (error)
            return res.status(400).send(error);

        // Need to validate body before continuing
        const post = new Post({
            userId: req.body.userId,
            comment: req.body.comment,
            likes: req.body.likes,
            dislikes: req.body.dislikes
        });
        await post.save();
        return res.send(post);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.delete("/:id", function(req, res, next) {

    Post.findByIdAndRemove(req.params.id, req.body, function(err, post) {
     if (err) return next(err);
     res.json(post);
    });
    
   });

module.exports = router;

