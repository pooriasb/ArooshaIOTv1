const express = require('express');
const router = express.Router();
const config = require('config');
const axios = require('axios');
const { route } = require('./powerSupply');



//Create new power supply
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      powerType,
      senarioId,
      maxPower
    } = req.body;

    if (!userId || !powerType || !senarioId || !maxPower) {
      res.status(400).send({ message: 'Please provide all required fields.' });
    }

    const result = await axios.post(config.EnergyAddress + '/api/power/', {
      userId,
      powerType,
      senarioId,
      maxPower
    });

    res.send(result.data);
  } catch (error) {
    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
      res.status(error.response.status).send({ message: error.response.data.message || 'Error occurred.' });
    } else {
      res.status(500).send({ message: 'Error occurred.' });
    }
  }
});

// get all power supplies of a user
router.get('/', async (req, res) => {
  try {
    const result = await axios.get(config.EnergyAddress + '/api/power/');
    res.send(result.data);
  } catch (error) {
    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
      res.status(error.response.status).send({ message: error.response.data.message || 'Error occurred.' });
    } else {
      res.status(500).send({ message: 'Error occurred.' });
    }
  }
});

// Get a single powerSupply by id
router.get('/:id', async (req, res) => {
  try {
    const result = await axios.get(config.EnergyAddress + '/api/power/' + req.params.id);
    res.send(result.data);
  } catch (error) {
    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
      res.status(error.response.status).send({ message: error.response.data.message || 'Error occurred.' });
    } else {
      res.status(500).send({ message: 'Error occurred.' });
    }
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const {
      userId,
      powerType,
      senarioId,
      maxPower
    } = req.body;

    if (!userId && !powerType && !senarioId && !maxPower) {
      res.status(400).send({ message: 'Please provide at least one field to update.' });
    }

    const result = await axios.patch(config.EnergyAddress + '/api/power/' + req.params.id, {
      userId,
      powerType,
      senarioId,
      maxPower
    });

    res.send(result.data);
  } catch (error) {
    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
      res.status(error.response.status).send({ message: error.response.data.message || 'Error occurred.' });
    } else {
      res.status(500).send({ message: 'Error occurred.' });
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await axios.delete(config.EnergyAddress + '/api/power/' + req.params.id);
    res.send(result.data);
  } catch (error) {
    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
      res.status(error.response.status).send({ message: error.response.data.message || 'Error occurred.' });
    } else {
      res.status(500).send({ message: 'Error occurred.' });
    }
  }
});

module.exports = router;
