const {User, validateUser} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);

        if (error)
            return res.status(400).send(error);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("This is not the user you're looking for...User already Registered.")

        const salt = await bcrypt.genSalt(10);

        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        })

        await user.save();
        return res.send('registed');
    }

    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})

router.get('/', async (req, res) => {
    try {
        let user = await User.find();
        return res.send(user);
    }

    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})

router.get('/:loggedInUserId', async (req, res) => {
    try {
        let user = await User.find({ _id: req.params.loggedInUserId });
        
        return res.send(user[0]);
    }

    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})

router.put('/updateImage', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.body.id,
            {
                profileImage: req.body.profileImage
            },
            { new: true }
          );
          
          await user.save();
          return res.send(user);
    }

    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})



module.exports = router
