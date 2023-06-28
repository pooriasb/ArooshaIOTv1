const express = require('express');
const router = express.Router();
const config = require('config');
const axios = require('axios');
router.use(express.json());

config.reportAddress
///api/report
router.get('/energyReports/:mac/:count', async (req, res) => {
    try {
        var result = await axios.get(`${config.reportAddress}/energyReports/${req.params.mac}/${req.params.count}`);
        res.status(200).json(result.data);
    } catch (error) {
        console.error('Error retrieving energy reports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
