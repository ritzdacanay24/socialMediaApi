const { FriendStatus, validate, friendSchema } = require('../models/friends');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(error);

        const friends = new FriendStatus({

            User_id: req.body.User_id,
            Requested_by: req.body.Requested_by,
            Online: req.body.Online,
            FriendStatus: req.body.FriendStatus

        });
        await friends.save();
        return res.send(friends);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/pendingRequests/:Requested_by/:FriendStatus', async (req, res) => {

    try {
        const friendRequest = await FriendStatus.find({ "Requested_by": req.params.Requested_by, "FriendStatus": req.params.FriendStatus });
        return res.send(friendRequest);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }

})

router.get('/api/friends/:User_id/:Requested_by', async (req, res) => {
try{
  const findFriends = await Friends.find({"User_id": req.params.User_id, "Requested_by": req.params.Requested_by});
return res.send(findFriends);
}catch(ex) {
  return res.status(500).send(`Internal Server Error: ${ex}`);
}

});

router.get('/api/friends/:User_id/:Requested_by/:Online', async (req, res) => {
try{
  const findFriends = await Friends.find({"User_id": req.params.User_id, "Requested_by": req.params.Requested_by, "Online": req.params.Online});
return res.send(findFriends);
}catch(ex) {
  return res.status(500).send(`Internal Server Error: ${ex}`);
}

});



module.exports = router;
