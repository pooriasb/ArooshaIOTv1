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

router.get('/addChild/:phone',async (req, res) => {
    var result = await User.createChildUser('sajad',req.params.phone);

    res.send(result);
});
router.get('/getChildren/',async (req, res) => {
    var result = await User.getChildren('sajad');
    res.send(result);
});
router.post('/blockChild/:childId',async (req, res) => {
    var result = await User.blockChild(req.params.childId);

    res.send(result);
});

router.post('/validateToken', async (req, res) => {
    var result = await User.validateJwt(req.body.token);
    res.send(result);
});

router.post('/decodeToken', async (req, res) => {
    var result = await User.validateJwt(req.body.token);
    if (result && result != 0) {
        var decoded = await User.decodeJwt(req.body.token);
        res.send(decoded);
    }
    res.send('Token is not valid');
});

router.post('/setSettings', async (req, res) => {
    const {settings} = req.body;
    var result = await User.setUserSettings('sajad',settings);
    res.send(result);
});

module.exports = router;