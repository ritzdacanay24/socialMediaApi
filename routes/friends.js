const { FriendStatus, validate, friendSchema } = require('../models/friends');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send(error);

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

router.get('/pendingRequests/:requestedBy/:friendStatus', async (req, res) => {
  try {
    const friendRequest = await FriendStatus.find({ "requestedBy": req.params.requestedBy, "friendStatus": req.params.friendStatus });
    return res.send(friendRequest);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
})

router.get('/friends/:userId/:requestedBy', async (req, res) => {
  try {
    const findFriends = await FriendStatus.find({ "userId": req.params.userId, "requestedBy": req.params.requestedBy });
    return res.send(findFriends);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.get('/friends/:userId/:requestedBy/:online', async (req, res) => {
  try {
    const findFriendsonline = await FriendStatus.find({ "userId": req.params.userId, "requestedBy": req.params.requestedBy, "online": req.params.online });
    return res.send(findFriendsonline);
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


module.exports = router;
