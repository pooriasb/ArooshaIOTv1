const express = require('express');
const router = express.Router();
const config = require('config');
const axios = require('axios');
router.use(express.json());
//EnergyAddress
router.get('/energyUsageByDevice/:mac/:start', async (req, res) => {
  try {
    const response = await axios.get(config.EnergyAddress + '/api/report/energyUsageByDevice/' + req.params.mac + '/' + req.params.start);
    if (response.data) {
      return res.status(200).send(response.data);
    } else {
      return res.status(500).send('Something went wrong when trying to get energy by device');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred while processing your request.');
  }
});


router.get('/energyUsageByUser/:userId/:start',async (req,res)=>{
    try {
        const response = await axios.get(config.EnergyAddress + '/api/report/energyUsageByUser/' + req.params.userId + '/' + req.params.start);
        if (response.data) {
          return res.status(200).send(response.data);
        } else {
          return res.status(500).send('Something went wrong when trying to get energy by device');
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while processing your request.');
      }
});


module.exports = router;