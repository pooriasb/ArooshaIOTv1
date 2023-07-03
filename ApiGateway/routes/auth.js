const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
router.get('/login/:phone', async (req, res) => {
    var response = await axios.get(config.AuthAddress + '/api/auth/login/' + req.params.phone);
    res.send(response.data);
});
router.get('/validatePhone/:phone/:code', async (req, res) => {
    var response = await axios.get(config.AuthAddress + '/api/auth/validatePhone/' + req.params.phone + '/' + req.params.code);
    res.send(response.data);
});
router.get('/addChild/:phone', async (req, res) => {
    var response = await axios.get(config.AuthAddress + '/api/auth/addChild/' + req.params.phone);
    res.send(response.data);
});

router.post('/blockChild/:childId',async (req, res) => {
    var response = await axios.post(config.AuthAddress + '/api/auth/blockChild/' + req.params.childId);
    res.send(response.data);
});
module.exports = router;