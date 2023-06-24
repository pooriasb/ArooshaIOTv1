const express = require('express');
const router = express.Router();
router.use(express.json());
const axios = require('axios');
const config = require('config');
const limit = require('../models/limit');
router.post('/createLimit', async (req, res) => {
    const { deviceMac, deviceName, maxUsePower, dimmer } = req.body;
    var result = await limit.createLimit({ 'sajad', deviceMac, deviceName, maxUsePower, dimmer });
    res.send(result);
});


module.exports = router;