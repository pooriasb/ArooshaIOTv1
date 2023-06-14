const express = require('express');
const router = express.Router();
const MessageLog = require('../models/messageLog');


router.post('/logMessage', (req, res) => {

    res.sendStatus(200)
});



router.get('/getLastMessage/:mac', (res, req) => {
    res.sendStatus(200)

});



module.exports = router;