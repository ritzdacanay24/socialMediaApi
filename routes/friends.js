const { FriendStatus, validate } =require('../models/friends');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(error);
        const friends = new FriendStatus({
         User_id: req
        });
        await product.save();
        return res.send(product);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});