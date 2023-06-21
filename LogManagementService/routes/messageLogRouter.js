const express = require('express');
const router = express.Router();
const MessageLog = require('../models/messageLog');

router.use(express.json());
router.post('/logMessage', async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const result = await MessageLog.createMessageLog(data.mac, JSON.stringify(data.message));
        console.log(`A logMessage saved: ${result} mac: ${data.mac}`);
        res.sendStatus(result);
    } catch (error) {
        console.error(error.message);
        res.sendStatus(500);
    }
});


router.get('/getLastMessage/:mac', async (req, res) => {
  try {
    const { mac } = req.params;
    const lastMessageLog = await MessageLog.readLastMessageLogByMac(mac);
    
    if(!lastMessageLog) return res.send({});
    
    return res.send(lastMessageLog.message);
    
  } catch(error) {
    console.error(`Error reading last message:`+ error.message);
    return res.status(500).send("Error occurred while retrieving last message");
  }
});


module.exports = router;