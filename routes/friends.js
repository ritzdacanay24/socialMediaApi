const { FriendStatus, validate, friendSchema } = require('../models/friends');
const { User } = require('../models/user');
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

    //check if the recipient is already a friend.
    const friendRequestConfirmed = await FriendStatus.find({ "requestedBy": req.params.loggedInUserId, "friendStatus": 'Confirmed' });
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
router.get('/pendingRequests/:requestedBy', async (req, res) => {
  try {
    const friendRequest = await FriendStatus.find({ "requestedBy": req.params.requestedBy, "friendStatus": 'Pending' });
    return res.send(friendRequest);
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

module.exports = router;
