const express = require('express');
const router = express.Router();
const config = require('config');
const axios = require('axios');


//config.EnergyAddress + '/api/power/'
//Create new power supply
router.post('/', (req, res) => {
    const {
        userId,
        powerType,
        senarioId,
        maxPower
    } = req.body;
    var result = axios.post(config.EnergyAddress + '/api/power/', {
        userId,
        powerType,
        senarioId,
        maxPower
    });
    res.send(result.data);
});



module.exports = router;
