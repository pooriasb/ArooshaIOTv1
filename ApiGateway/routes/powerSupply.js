const express = require('express');
const router = express.Router();
const config = require('config');
const axios = require('axios');
const { route } = require('./powerSupply');


//config.EnergyAddress + '/api/power/'
//Create new power supply
router.post('/', async (req, res) => {
    const {
        userId,
        powerType,
        senarioId,
        maxPower
    } = req.body;
    var result = await axios.post(config.EnergyAddress + '/api/power/', {
        userId,
        powerType,
        senarioId,
        maxPower
    });
    res.send(result.data);
});
// get all power supplies of a user
router.get('/', async (req, res) => {
    var result = await axios.get(config.EnergyAddress + '/api/power/');
    res.send(result.data);
});

// Get a single powerSupply by id
router.get('/:id', async (req, res) => {
    var result = await axios.get(config.EnergyAddress + '/api/power/'+req.params.id);
    res.send(result.data);
});

router.patch('/:id',async (req,res)=>{
    const {
        userId,
        powerType,
        senarioId,
        maxPower
    } = req.body;
    var result = await axios.patch(config.EnergyAddress + '/api/power/'+req.params.id,{
        userId,
        powerType,
        senarioId,
        maxPower
    });
    res.send(result.data);
});

router.delete('/:id', async (req, res) => {
    var result = await axios.delete(config.EnergyAddress + '/api/power/'+req.params.id);
    res.send(result.data);
});
module.exports = router;
