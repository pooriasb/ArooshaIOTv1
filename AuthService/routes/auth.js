const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/login/:phone', async (req, res) => {

    var result = await User.createUserAndSendCode(req.params.phone);
res.send(result);

});


module.exports = router;