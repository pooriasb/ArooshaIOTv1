const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.use(express.json());
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
router.get('/getChildren/:userId',async (req, res) => {
    var result = await User.getChildren(req.params.userId);
    res.send(result);
});
router.post('/blockChild/:childId',async (req, res) => {
    var result = await User.blockChild(req.params.childId);

    res.send(result);
});

router.post('/validateToken', async (req, res) => {
  try {
    var result = await User.validateJwt(req.body.token);
    console.log('validate token : '+result);
    res.send(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(false);
  }
});


router.post('/decodeToken', async (req, res) => {
  try {
    const result = await User.validateJwt(req.body.token);
    if (result && result !== 0) {
      const decoded = await User.decodeJwt(req.body.token);
      res.send(decoded);
    } else {
      res.send('Token is not valid');
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/setSettings', async (req, res) => {
    const {settings} = req.body;
    var result = await User.setUserSettings('sajad',settings);
    res.send(result);
});

module.exports = router;