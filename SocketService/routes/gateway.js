const express = require('express');
const router = express.Router();
const axios = require('axios');
router.get('/sendMessage', (req, res) => {
    res.sendStatus(200);
});


module.exports = router;