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
router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send(error);

    const findUser = await User.findById(req.body.requestedBy);
    if (!findUser)
      return res.send('User not found');

    const friends = new FriendStatus({
      userId: req.body.userId,
      requestedBy: req.body.requestedBy,
      online: req.body.online,
      friendStatus: req.body.friendStatus
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
    if(!allMyFriends.length) return res.send('Sorry you have no friends');

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
    
    if(!allMyFriends.length) return res.send('Sorry you have no friends online');

    //send friends online
    return res.send(allMyFriends);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
