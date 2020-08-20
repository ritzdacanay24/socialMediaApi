const express = require('express');
const router = express.Router();
const Joi = require('joi');



router.get('/api/friends/:User_Id/:Requested_by', async (req, res) => {
    try{
      let findFriends = await Friends.find({User_id:req.params.User_Id}, {Requested_by:req.params.Requested_by});
      if(!findFriends)
      return res.status(400).send(`No Friends Found.`);
      return res.send(findFriends);
    }catch (ex) {
      return res.status(500).send (`Internal Server Error: ${ex}`);
    }

});

router.get('/api/friends/:User_id/:Requested_by/:Online', (req, res) => {
  try{
    const findOnlineFriends = Friends.find({User_id:req.params.User_Id}, {Requested_by:req.params.Requested_by}, {Online:req.params.Online});
    if(!findOnlineFriends)
    return res.status(400).send(`No Friends Found.`);
    return res.send(findOnlineFriends);
  }catch(ex) {
    return res.status(500).send(`Internal Server Error:${ex}`);
  }
});

module.exports = router;
