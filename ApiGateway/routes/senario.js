const express = require('express');
const router = express.Router();
const config = require('config');
const axios = require('axios');
router.use(express.json());
///api/senario

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


router.get('/getMySenarioList',checkAuth, async (req, res) => {
  try {
    const response = await axios.get(config.SchedulerAddress + '/api/senario/Senarios/' + req.userId);
    if (response.data) return res.status(200).send(response.data);
    return res.status(500).send('no response from schedule service')
  } catch (error) {
    console.error("Error getting Senario list ");
    res.sendStatus(500);
  }
});
router.get('/getSenario/:senarioId',checkAuth, async (req, res) => {
  try {
    const response = await axios.get(config.SchedulerAddress + '/api/senario/Senario/' + req.params.senarioId);
    if (response.data) return res.status(200).send(response.data);
    return res.status(500).send('no response from schedule service')
  } catch (error) {
    console.error("Error getting Senario list ");
    res.sendStatus(500);
  }
});

router.post('/createSenario',checkAuth, async (req, res) => {
  const { name, eventList } = req.body;
  try {
    const response = await axios.post(
      `${config.SchedulerAddress}/api/senario/createSenario`,
      { name, eventList }
    );
    const { data } = response;

    if (data) {
      return res.status(200).send(data);
    } else {

      return res.status(500).send('No data from senario service');

    }

  } catch (error) {
    console.error('Error creating senario:', error.message);
    res.status(500).send('Error creating senario');
  }
});

router.post('/startSenario',checkAuth, async (req, res) => {
  try {
    const { senarioId } = req.body;
    const response = await axios.post(
      `${config.SchedulerAddress}/api/senario/startSenario`,
      { senarioId }
    );
    if (response.data) {
      return res.status(200).send(response.data);
    } else {
      return res.status(500).send('Response data is empty.');
    }
  } catch (error) {
    console.error('Error starting senario:', error.message);
    return res.status(500).send('An error occurred while starting the senario.');
  }
});

router.post('/updateSenario',checkAuth, async (req, res) => {
  const { name, eventList, senarioId } = req.body;
  try {
    const response = await axios.post(
      `${config.SchedulerAddress}/api/senario/updateSenario`,
      { name, eventList, senarioId }
    );
    if (response.data) {
      return res.status(200).send(response.data);
    } else {
      return res.status(500).send('updateSenario-Response data is empty.');
    }
  } catch (error) {
    console.log('Error updating senario:', error.message);
    return res.status(500).send('An error occurred while updating the senario.');
  }
});

router.get('/deleteSenario/:senarioId',checkAuth, async (req, res) => {
  try {
    const response = await axios.get(config.SchedulerAddress + '/api/senario/deleteSenario/' + req.params.senarioId);
    if (response.data) {
      return res.status(200).send(response.data);
    } else {
      return res.status(500).send('deleteSenario-Response data is empty.');
    }
  } catch (error) {
    console.log('Error: ' + error);
    return res.status(500).send(error.message);
  }
});



module.exports = router;