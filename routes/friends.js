const { FriendStatus, validate } = require('../models/friends');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // const { error } = validate(req.body);
        // if (error)
        //     return res.status(400).send(error);

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


module.exports = router;
