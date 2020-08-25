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
router.get('/viewFriendPosts/:loggedInUserId', async (req, res) => {
    try {

        let findFriends = []; 
        //Confirmed friends. If the recipent accepts the friend request, get the id of that requestor.
        findFriends = await FriendStatus.find({ "requestedBy": req.params.loggedInUserId, "friendStatus": 'Confirmed' }).sort('-date').distinct('userId');

        if(!findFriends.length)
        //Confirmed friends. If not the requestor but the recipent get the id of the requestor.
        findFriends = await FriendStatus.find({ "userId": req.params.loggedInUserId, "friendStatus": 'Confirmed' }).sort('-date').distinct('requestedBy');
        
        let result = await Post.aggregate([
            { 
                $match: { 'userId': { $in: findFriends } }
            },{ 
                "$addFields" : { "userId": { "$toObjectId": "$userId" } } 
            },{ 
                $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userInfo" } },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    id: '$userInfo._id',
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

//view all posts
router.get('/', async (req, res) => {
    try {
        
        let result = await Post.aggregate([
            { "$addFields": { "userId": { "$toObjectId": "$userId" } } },
            { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userInfo" } },
            { $unwind: "$userInfo" },
            {
                $project: {
                    createdById: '$userInfo._id',
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

