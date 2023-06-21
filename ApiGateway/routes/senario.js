const express = require('express');
const router = express.Router();
const config = require('config');
const axios = require('axios');
///api/senario
router.get('/getMySenarioList/:userId', async (req, res) => {
  try {
    const response = await axios.get(config.SchedulerAddress + '/api/senario/scenarios' + req.params.userId);
    if (response.data) return res.status(200).send(response.data);
    return res.status(500).send('no response from schedule service')
  } catch (error) {
    console.error("Error getting scenario list ");
    res.sendStatus(500);
  }
});
router.get('/getSenario/:senarioId', async (req, res) => {
  try {
    const response = await axios.get(config.SchedulerAddress + '/api/senario/scenario' + req.params.senarioId);
    if (response.data) return res.status(200).send(response.data);
    return res.status(500).send('no response from schedule service')
  } catch (error) {
    console.error("Error getting scenario list ");
    res.sendStatus(500);
  }
});

router.post('/createSenario', async (req, res) => {
  const { userId, name, eventList } = req.body;
  
  try {
    const response = await axios.post(
      `${config.SchedulerAddress}/api/senario/createSenario`,
      { userId:'sajad', name, eventList }
    );
    const { data } = response;
    
    if (data) {
      return res.status(200).send(data);
    } else {
      throw new Error('No data from senario service');
    }
  } catch (error) {
    console.error('Error creating senario:', error.message);
    res.status(500).send('Error creating senario');
  }
});

router.post('/startSenario', (req, res) => {
  res.sendStatus(200);
});
router.post('/updateSenario', (req, res) => {
  res.sendStatus(200);
});
router.post('/deleteSenario/:senarioId', (req, res) => {
  res.sendStatus(200);
});



module.exports = router;