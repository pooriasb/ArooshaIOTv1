const express = require('express');
const router = express.Router();
const config = require('config');
const axios = require('axios');
router.use(express.json());

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


//Create new power supply
router.post('/',checkAuth ,async (req, res) => {
  try {
    const{userId} = req;
    const {
      powerType,
      senarioId,
      maxPower,
      mac
    } = req.body;

    if (!userId || !powerType || !senarioId || !maxPower) {
      res.status(400).send({ message: 'Please provide all required fields.' });
    }

    const result = await axios.post(config.EnergyAddress + '/api/power/', {
      userId,
      powerType,
      senarioId,
      maxPower,
      mac
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
router.get('/',checkAuth, async (req, res) => {
  try {
    const {userId} = req;
    const result = await axios.get(config.EnergyAddress + '/api/power/list/'+userId);
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
router.get('/:id',checkAuth, async (req, res) => {
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


router.post('/powerSupply', async (req, res) => {
  try {
    const{userId} = req;
    const {
      id,
      powerType,
      senarioId,
      maxPower,
      mac
    } = req.body;

    if (!userId || !powerType || !senarioId || !maxPower) {
      res.status(400).send({ message: 'Please provide all required fields.' });
    }

    const result = await axios.post(config.EnergyAddress + '/api/power/powerSupply', {
      userId,
      id,
      powerType,
      senarioId,
      maxPower,
      mac
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

module.exports = router;
