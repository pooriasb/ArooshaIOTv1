const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');






const checkAuth = async (req, res, next) => {
  const { token } = req.headers;
  console.clear();
  console.log('client IP : ' + req.ip);
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {

    var validateTokenResult = await axios.post(config.AuthAddress + `/api/auth/validateToken`, { token: token });
    console.log('token validation result:' + validateTokenResult.data);
    if (validateTokenResult.data == true) {
      var decodedToken = await axios.post(config.AuthAddress + `/api/auth/decodeToken`, { token: token });
      console.log(decodedToken.data);
      req.userId = decodedToken.data.userId;
      next();
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/login/:phone', async (req, res) => {
  try {
    var response = await axios.get(config.AuthAddress + '/api/auth/login/' + req.params.phone);
    res.status(200).send(response.data);
  } catch (error) {
    // Handle the error here
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/validatePhone/:phone/:code', async (req, res) => {
  try {
    var response = await axios.get(config.AuthAddress + '/api/auth/validatePhone/' + req.params.phone + '/' + req.params.code);
    res.status(200).send(response.data);
  } catch (error) {
    // Handle the error here
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/addChild/:phone', checkAuth, async (req, res) => {
  try {
    const { userId } = req;
    var response = await axios.get(config.AuthAddress + '/api/auth/addChild/' + req.params.phone + '/' + userId);
    res.status(200).send(response.data);
  } catch (error) {
    // Handle the error here
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/blockChild/:childId', checkAuth, async (req, res) => {
  try {
    var response = await axios.post(config.AuthAddress + '/api/auth/blockChild/' + req.params.childId);
    res.send(response.data);
  } catch (error) {
    // Handle the error here
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/getChildren', checkAuth, async (req, res) => {
  try {
    const { userId } = req;
    var response = await axios.get(config.AuthAddress + '/api/auth/getChildren/' + userId);
    res.send(response.data);
  } catch (error) {
    // Handle the error here
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/setSettings', checkAuth, async (req, res) => {
  try {
    const { settings } = req.body;
    const {userId} = req;
    var response = await axios.post(config.AuthAddress + '/api/auth/setSettings/', {userId,settings });
    res.status(500).send(response.data);
  } catch (error) {
    // Handle the error here
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/getUserbyId/:userId', checkAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    var response = await axios.get(config.AuthAddress + '/api/auth/getUserbyId/' + userId);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/getUserbyId', checkAuth, async (req, res) => {
  try {
    const { userId } = req;
    var response = await axios.get(config.AuthAddress + '/api/auth/getUserbyId/' + userId);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;