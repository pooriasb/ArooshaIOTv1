const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.use(express.json());
router.get('/login/:phone/:name', async (req, res) => {
  var result = await User.createUserAndSendCode(req.params.phone, req.params.name);
  res.send(result);
});

router.get('/validatePhone/:phone/:code', async (req, res) => {
  var result = await User.authenticateUser(req.params.phone, req.params.code);
  res.send(result);
});

router.get('/addChild/:phone/:userId/:name', async (req, res) => {
  var result = await User.createChildUser(req.params.userId, req.params.phone, req.params.name);

  res.send(result);
});
router.get('/getChildren/:userId', async (req, res) => {
  var result = await User.getChildren(req.params.userId);
  res.send(result);
});
router.post('/blockChild/:childId', async (req, res) => {
  var result = await User.blockChild(req.params.childId);
  res.send(result);
});
router.post('/unblockChild/:childId', async (req, res) => {
  var result = await User.unblockChild(req.params.childId);
  res.send(result);
});
router.post('/validateToken', async (req, res) => {
  try {
    var result = await User.validateJwt(req.body.token);
    console.log('validate token : ' + result);
    return res.send(result);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(false);
  }
});


router.post('/decodeToken', async (req, res) => {
  try {
    const result = await User.validateJwt(req.body.token);
    if (result && result !== 0) {
      const decoded = await User.decodeJwt(req.body.token);
      return res.send(decoded);
    } else {
      return res.send('Token is not valid');
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});


router.post('/setSettings', async (req, res) => {
  const { userId, settings } = req.body;
  var result = await User.setUserSettings(userId, settings);
  res.send(result);
});
router.post('/updateName', async (req, res) => {
  const { userId, newName } = req.body;
  var result = await User.updateName(userId, newName);
  res.send(result);
});

router.get('/getUserbyId/:userId', async (req, res) => {
  const { userId } = req.params;
  var result = await User.getUserById(userId);
  res.send(result);
});
router.get('/deleteChildUser/:userId', async (req, res) => {
  const { userId } = req.params;
  var result = await User.deleteChildUser(userId);
  res.send(result);
});


module.exports = router;