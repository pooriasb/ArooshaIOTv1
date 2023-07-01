const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/login/:phone', async (req, res) => {
    var result = await User.createUserAndSendCode(req.params.phone);
    res.send(result);
});

router.get('/validatePhone/:phone/:code', async (req, res) => {
    var result = await User.authenticateUser(req.params.phone, req.params.code);

    res.send(result);
});
module.exports = router;