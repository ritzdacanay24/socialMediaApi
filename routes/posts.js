const { Post, validatePost } = require('../models/post');
const { FriendStatus } = require('../models/friends');

const express = require('express');
const router = express.Router();

function getFriendInfo(findFriends) {
    let userId = [];
    //second get all online status from user object
    findFriends.forEach(function (user) {
      userId.push(user.userId)
    });
    return userId;
  }

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
        if (!findFriends) return res.send(`You are han solo. You have no friends!`);
        
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

