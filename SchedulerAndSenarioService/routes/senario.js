
const express = require('express');
const router = express.Router();
const senario = require('../models/senarioModel');


router.post('/createSenario', async (req, res) => {
    try {
        const result = await senario.createSenario(req.body); // assuming the request body contains the necessary data
        if (result === "1") {
            res.status(200).send('Senario created successfully');
        } else {
            res.status(500).send('Error creating senario');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating senario');
    }
});

router.get('/deleteSenario/:userId', async (req, res) => {
    try {
        const result = await senario.deleteSenario(req.params.userId); // assuming the user id is passed as a param in the URL
        if (result === "1") {
            res.status(200).send('Senario deleted successfully');
        } else {
            res.status(500).send('Error deleting senario');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting senario');
    }
});

router.get('/scenarios/:userId', async (req, res) => {
    try {
        const result = await senario.readScenarios(req.params.userId); // assuming the user id is passed as a param in the URL
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error getting scenarios');
    }
});


app.get('/scenario/:senarioId', async (req, res) => {
    try {
      const senarioId = req.params.senarioId;
      const result = await senario.readScenario(senarioId);
      
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error getting scenario');
    }
  });

module.exports = router;
