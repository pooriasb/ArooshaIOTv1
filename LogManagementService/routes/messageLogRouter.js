const express = require('express');
const router = express.Router();
const MessageLog = require('../models/messageLog');

router.use(express.json());
router.post('/logMessage',async (req, res) => {
    var data = req.body;
 var result =  await  MessageLog.createMessageLog(data.mac,data.message);
 console.log(`A logMessage saved: ${result} mac:${data.mac} message : ${data.message}`);
    res.sendStatus(result);
});



router.get('/getLastMessage/:mac',async (req, res) => {
     var result =await MessageLog.readLastMessageLogByMac(req.params.mac);
    res.send(result);
});



module.exports = router;