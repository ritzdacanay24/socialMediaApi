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

<<<<<<< HEAD
router.get('/pendingRequests/:Requested_by/:FriendStatus', async (req, res) => {

    try {
        const friendRequest = await FriendStatus.find({ "Requested_by": req.params.Requested_by, "FriendStatus": req.params.FriendStatus });
        return res.send(friendRequest);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }

=======
//View Pending friend requests
router.get('/pendingRequests/:requestedBy/:friendStatus', async (req, res) => {
  try {
    const friendRequest = await FriendStatus.find({ "requestedBy": req.params.requestedBy, "friendStatus": req.params.friendStatus });
    return res.send(friendRequest);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
})
>>>>>>> 664b805fcafc06286e023f8c54a562c78746c5df

//View all friends
router.get('/friends/:requestedBy', async (req, res) => {
  try {
    const findFriends = await FriendStatus.find({ "requestedBy": req.params.requestedBy, "friendStatus": 'Confirmed' });
    return res.send(findFriends);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//View online friends
router.get('/onlineFriends/:requestedBy', async (req, res) => {
  try {
    //first get all friends
    const findFriends = await FriendStatus.find({ "requestedBy": req.params.requestedBy, "friendStatus": 'Confirmed' });

    //put users into an array
    let userId = getFriendInfo(findFriends);

    //from the userarray find users in the users collections
    const friends = await User.find({ "_id": { $in: userId }, "loginTime": { "$ne": null } }, ['firstName', 'lastName']);

    //send friends online
    return res.send(friends);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// router.get('/friends/:userId/:requestedBy', async (req, res) => {
//   try{
//     const findFriends = await Friends.find({"userId": req.params.userId, "requestedBy": req.params.requestedBy, "online": req.params.online});
//   return res.send(findFriends);
//
// }catch(ex) {
//   return res.status(500).send(`Internal Server Error: ${ex}`);
// }
//
// });

<<<<<<< HEAD

})

=======
>>>>>>> 664b805fcafc06286e023f8c54a562c78746c5df
module.exports = router;
