const express = require('express');
const router = express.Router();
router.use(express.json());
const axios = require('axios');
const config = require('config');
const limit = require('../models/limit');
router.post('/createLimit', async (req, res) => {
    const { deviceMac, deviceName, maxUsePower, dimmer } = req.body;
    var result = await limit.createLimit({ userId: 'sajad', deviceMac, deviceName, maxUsePower, dimmer });
    res.send(result);
});
router.get('/', (req, res) => { res.send('hi get') });
router.post('/', (req, res) => { res.send('hi post') });



router.get('/limitCheck/:limitId', async (req, res) => {

    var result = await limit.LimitCheck(req.params.limitId);
    res.send(result);
});
module.exports = router;