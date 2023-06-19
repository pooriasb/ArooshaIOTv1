const express = require('express');
const router = express.Router();
const MessageLog = require('../models/messageLog');

router.use(express.json());
router.post('/logMessage', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const result = await MessageLog.createMessageLog(data.mac, data.message);
    console.log(`A logMessage saved: ${result} mac: ${data.mac}`);
    res.sendStatus(result);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
});



router.get('/getLastMessage/:mac',async (req, res) => {
     var result =await MessageLog.readLastMessageLogByMac(req.params.mac);
    res.send(result);
});



module.exports = router;