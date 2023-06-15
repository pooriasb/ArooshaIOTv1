const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
router.get('/login/:phone', async (req, res) => {
    var response = await axios.get(config.AuthAddress + '/api/auth/login/' + req.params.phone);
    res.send(response.data);
});

module.exports = router;