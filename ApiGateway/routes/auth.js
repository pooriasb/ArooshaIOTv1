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
    var response = await axios.get(config.AuthAddress + '/api/auth/login/' + req.params.phone);
    res.send(response.data);
});
router.get('/validatePhone/:phone/:code', async (req, res) => {
    var response = await axios.get(config.AuthAddress + '/api/auth/validatePhone/' + req.params.phone + '/' + req.params.code);
    res.send(response.data);
});
router.get('/addChild/:phone',checkAuth, async (req, res) => {
    var response = await axios.get(config.AuthAddress + '/api/auth/addChild/' + req.params.phone);
    res.send(response.data);
});

router.post('/blockChild/:childId',checkAuth, async (req, res) => {
    var response = await axios.post(config.AuthAddress + '/api/auth/blockChild/' + req.params.childId);
    res.send(response.data);
});

router.get('/getChildren',checkAuth,async (req, res) => {
    const {userId} = req;
    var response = await axios.get(config.AuthAddress + '/api/auth/getChildren/'+ userId);
    res.send(response.data);
});

router.post('/setSettings',checkAuth, async (req, res) => {
    const {settings} = req.body;
    var response = await axios.post(config.AuthAddress + '/api/auth/setSettings/',{settings});
    res.send(response.data);
});
module.exports = router;