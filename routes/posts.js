const { Post, validatePost } = require('../models/post');
const { FriendStatus } = require('../models/friends');

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


//view friends posts
router.get('/viewFriendPosts/:userId', async (req, res) => {
    try {

        //first get my friends
        const findFriends = await FriendStatus.find({ "requestedBy": req.params.userId, "friendStatus": 'Confirmed' }).sort('-date');
        if (!findFriends) return res.send(`Sorry you have no friends`);

        //first get my friends
        const findFriends1 = await FriendStatus.find({ "userId": req.params.userId, "friendStatus": 'Confirmed' }).sort('-date');
        if (!findFriends) return res.send(`Sorry you have no friends`);
        
        //get my friends posts
        //put users into an array
        let myFriends = getFriendInfo(findFriends);
        
        let result = await Post.aggregate([
            {
                $match:
                {
                    'userId':
                        { $in: myFriends }
                }
            },
            { "$addFields": { "userId": { "$toObjectId": "$userId" } } },

            { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userInfo" } },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    firstName: '$userInfo.firstName',
                    lastName: '$userInfo.lastName',
                    comment: '$comment',
                    likes: '$likes',
                    dislikes: '$dislikes'
                }
            }

        ]);
        return res.send(result);


    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.delete("/:id", function (req, res, next) {

    Post.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });

});

module.exports = router;

