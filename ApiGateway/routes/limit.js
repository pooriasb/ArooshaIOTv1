const express = require('express');
const router = express.Router();
const config = require('config');
const axios = require('axios');
router.use(express.json());

///api/limit
// Endpoint to check a limit entry by ID
router.get('/Check/:id', async (req, res) => {
    try {
      const result = await axios.get(config.EnergyAddress + '/api/limit/Check/' + req.params.id);
      res.send(result.data);
    } catch (error) {
      if (error.response && (error.response.status === 500 || error.response.status === 400 || error.response.status === 404)) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  });
  
  // Endpoint to create a new limit entry
  router.post('/create', async (req, res) => {
    const { userId, deviceMac, deviceName, maxUsePower, dimmer } = req.body;
    if (!userId) {
      res.status(400).send('Please provide a valid userId');
    } else if (!deviceMac) {
      res.status(400).send('Please provide a valid deviceMac');
    } else if (!deviceName) {
      res.status(400).send('Please provide a valid deviceName');
    } else if (!maxUsePower) {
      res.status(400).send('Please provide a valid maxUsePower');
    } else if (!dimmer) {
      res.status(400).send('Please provide a valid dimmer');
    } else {
      try {
        const result = await axios.post(config.EnergyAddress + '/api/limit/create', {
          userId, deviceMac, deviceName, maxUsePower, dimmer
        });
        res.send(result.data);
      } catch (error) {
        if (error.response && (error.response.status === 500 || error.response.status === 400 || error.response.status === 404)) {
          res.status(error.response.status).send(error.response.data);
        } else {
          res.status(500).send('Internal Server Error');
        }
      }
    }
  });
  
  // Endpoint to get a limit entry by userId
  router.get('/:userId', async (req, res) => {
    try {
      const result = await axios.get(config.EnergyAddress + '/api/limit/' + req.params.userId);
      res.send(result.data);
    } catch (error) {
      if (error.response && (error.response.status === 500 || error.response.status === 400 || error.response.status === 404)) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  });
// Endpoint to get a single limit entry by ID
router.get('/single/:id', async (req, res) => {
  try {
    const result = await axios.get(config.EnergyAddress + '/api/limit/single/' + req.params.id);
    res.send(result.data);
  } catch (error) {
    if (error.response && (error.response.status === 500 || error.response.status === 400 || error.response.status === 404)) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

// Endpoint to update a limit entry by ID
router.post('/update/:id',async (req, res) => {
  const { userId, deviceMac, deviceName, maxUsePower, dimmer } = req.body;
  if (!userId) {
    res.status(400).send('Please provide a valid userId');
  } else if (!deviceMac) {
    res.status(400).send('Please provide a valid deviceMac');
  } else if (!deviceName) {
    res.status(400).send('Please provide a valid deviceName');
  } else if (!maxUsePower) {
    res.status(400).send('Please provide a valid maxUsePower');
  } else if (!dimmer) {
    res.status(400).send('Please provide a valid dimmer');
  } else {
    try {
      const result = await axios.post(config.EnergyAddress + '/api/limit/update/' + req.params.id, {
        userId, deviceMac, deviceName, maxUsePower, dimmer
      });
      res.send(result.data);
    } catch (error) {
      if (error.response && (error.response.status === 500 || error.response.status === 400 || error.response.status === 404)) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  }
});

// Endpoint to delete a specific limit entry by ID


// Endpoint to delete a limit entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await axios.delete(config.EnergyAddress + '/api/limit/' + req.params.id);
    res.send(result.data);
  } catch (error) {
    if (error.response && (error.response.status === 500 || error.response.status === 400 || error.response.status === 404)) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

// Endpoint to set a specific limit entry as active or inactive by ID
router.post('/:id', async (req, res) => {
  try {
    const isActive = req.body.isActive;
    const result = await axios.post(config.EnergyAddress + '/api/limit/' + req.params.id,{isActive});
    res.send(result.data);
  } catch (error) {
    if (error.response && (error.response.status === 500 || error.response.status === 400 || error.response.status === 404)) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});



module.exports = router;
