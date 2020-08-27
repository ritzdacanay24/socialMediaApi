const { FriendStatus, validate, friendSchema } = require('../models/friends');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

//Send a friend request. 
router.post('/friendRequest/:loggedInUserId/:friendRequestId', async (req, res) => {
  try {

    //check if the friend id is in the database.
    const findUser = await User.findById(req.params.friendRequestId)

    if (!findUser)
      return res.send('Friend id not found');

    //check if a friend request was already submiited.
    const friendRequestPending = await FriendStatus.find({ "requestedBy": req.params.loggedInUserId, "userId": req.params.friendRequestId, "friendStatus": 'Pending' });
    if (friendRequestPending.length > 0)
      return res.send('Friend request has not been accepted yet.');

    //cant send friend request back to the sender vice versa. 
    const checkReverseSendRequest = await FriendStatus.find({ "userId": req.params.loggedInUserId, "requestedBy": req.params.friendRequestId, "friendStatus": 'Pending' });
    if (checkReverseSendRequest.length > 0)
      return res.send('Sorry, you cant send a friend request to the person who sent you a friend request silly! How about accepting their invite?');

    //check if the recipient is already a friend.
    const friendRequestConfirmed = await FriendStatus.find({ $or:[ {'requestedBy':req.params.loggedInUserId}, {'userId':req.params.loggedInUserId} ] , "friendStatus": 'Confirmed' });
    if (friendRequestConfirmed.length > 0)
      return res.send('You are already friends with this user.');

    const friends = new FriendStatus({
      userId: req.params.friendRequestId,
      requestedBy: req.params.loggedInUserId
    });

    await friends.save();
    return res.send(friends);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//View Pending friend requests
router.get('/pendingRequests/:loggedInUserId', async (req, res) => {
  try {

    let result = await FriendStatus.aggregate([
      { $match: { "userId": req.params.loggedInUserId, "friendStatus": 'Pending' }
      },
      { "$addFields": { "requestedBy": { "$toObjectId": "$requestedBy" } } },
      { $lookup: { from: "users", localField: "requestedBy", foreignField: "_id", as: "userInfo" } },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: '$_id',
          friendStatus: '$friendStatus',
          userId: '$userId',
          requestedBy: '$requestedBy',
          requestedByInfo: {
            _id: '$userInfo._id',
            firstName: '$userInfo.firstName',
            lastName: '$userInfo.lastName',
            email: '$userInfo.email',
            profileImage: '$userInfo.profileImage'
          }
        }
      }

    ]);

    if (!result.length) return res.send('Sorry you have no pending friend requests.');

    return res.send(result);

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
})

//View all confirmed friends
router.get('/friends/:loggedInUserId', async (req, res) => {
  try {

    const loggedInUserId = req.params.loggedInUserId;
    let findFriends = [];

    //Confirmed friends. If the recipient accepts the friend request, get the id of that requestor.
    findFriends = await FriendStatus.find({ "requestedBy": loggedInUserId, "friendStatus": 'Confirmed' }).distinct('userId');

    if (!findFriends.length)
      //Confirmed friends. If not the requestor but the recipient get the id of the requestor.
      findFriends = await FriendStatus.find({ "userId": loggedInUserId, "friendStatus": 'Confirmed' }).distinct('requestedBy');

    //get friends from user collection
    const allMyFriends = await User.find({ "_id": { $in: findFriends } }, ['firstName', 'lastName', 'email', 'loginTime', 'profileImage']);
    if (!allMyFriends.length) return res.send('Sorry you have no friends');
    

    return res.send(allMyFriends);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//View online friends
router.get('/onlineFriends/:loggedInUserId', async (req, res) => {
  try {

    const loggedInUserId = req.params.loggedInUserId;
    let findFriends = [];

    //Confirmed friends. If the recipient accepts the friend request, get the id of that requestor.
    findFriends = await FriendStatus.find({ "requestedBy": loggedInUserId, "friendStatus": 'Confirmed' }).distinct('userId');

    if (!findFriends.length)
      //Confirmed friends. If not the requestor but the recipient get the id of the requestor.
      findFriends = await FriendStatus.find({ "userId": loggedInUserId, "friendStatus": 'Confirmed' }).distinct('requestedBy');

    //get friends from user collection that is logged in
    const allMyFriends = await User.find({ "_id": { $in: findFriends }, "loginTime": { "$ne": null } }, ['firstName', 'lastName', 'email', 'loginTime', 'profileImage']);

    if (!allMyFriends.length) return res.send('Sorry you have no friends online');

    //send friends online
    return res.send(allMyFriends);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Accept Friend Request
router.put('/accept/:id', async (req, res) => {
  try {

    const friendRequest = await FriendStatus.findByIdAndUpdate(
      req.params.id,
      {
        friendStatus: 'Confirmed'
      },
      { new: true }
    );
    if (!friendRequest)
      return res.status(400).send(`The friend with id "${req.params.id}" does not exist.`);

    await friendRequest.save();
    return res.send(friendRequest);

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Delete pending friend request
router.delete('/delete/:id', async (req, res) => {
  try {

    FriendStatus.findByIdAndRemove(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//Delete confirmed friend
router.delete('/deleteFriend/:loggedInUserId/:userFriendId', async (req, res) => {
  try {

    const findFriendId = await FriendStatus.findOne({ $or:[ {'requestedBy':req.params.loggedInUserId}, {'userId':req.params.loggedInUserId} ], $or:[ {'requestedBy':req.params.userFriendId}, {'userId':req.params.userFriendId} ] }).distinct('_id');
    console.log(findFriendId)
    if(!findFriendId.length) return res.send('Sorry unable to delete A-hole friend!');
    
    FriendStatus.findByIdAndRemove(findFriendId[0], function (err, post) {
      if (err) return next(err);
      res.json({message: "A-hole friend deleted!"});
    });

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
