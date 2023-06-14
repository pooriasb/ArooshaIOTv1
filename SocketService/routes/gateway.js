const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
router.get('/sendMessage', (req, res) => {

    res.sendStatus(200);
});


module.exports = router;