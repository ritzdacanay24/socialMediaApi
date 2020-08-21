const {User, validateUser} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');








router.post('/', async (req, res) => {
    try {
        const {error} = validateUser(req.body);

        if (error)
            return res.status(400).send(error);

        let user = await User.findOne({email:req.body.email});
        if (user) return res.status(400).send("This is not the user you're looking for...User already Registered.")
        
        const salt = await bcrypt.genSalt(10);

        user = new User({

            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        })

        await user.save();
        const token = user.generateAuthToken()
        

        return res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send({_id: user._id, firstName: user.firstName, email: user.email});
        }

   catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`)
}
})


// router.post('/:videoId/comments', async (req, res) => {
//     try {
//         const videos = await Video.find({videoId: req.params.videoId});
//         let video = videos[0];

//         const comment = new Comment({
//             text: req.body.text,
//             replies: []
//         });

//         if (!video){
//         video = new Video({
//             videoId: req.params.videoId,
//             likes: 0,
//             dislikes: 0,
//             comments: [comment]
//         }); 
//         }else{
//             video.comments.push(comment);
//         }

//         await video.save();
//         return res.send(comment);
//     } 
//     catch (ex) {
//         return res.status(500).send(`Internal Server Error: ${ex}`);
//     }
// });

module.exports = router