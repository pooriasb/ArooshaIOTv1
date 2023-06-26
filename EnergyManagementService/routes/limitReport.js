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



router.post('/create', async (req, res) => {
    const { userId, deviceMac, deviceName, maxUsePower, dimmer } = req.body;
    try {
      const result = await limit.createLimit({ userId, deviceMac, deviceName, maxUsePower, dimmer });
      res.status(201).json({ success: true, message: 'Limit entry created successfully', data: result });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });



module.exports = router;