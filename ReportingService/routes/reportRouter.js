const express = require('express');
const router = express.Router();
const {
  readEnergyReports,
  deleteEnergyReport,
  createEnergyReport
} = require('../model/report');

// Get energy reports for a specific MAC address
router.get('/energyReports/:mac/:count', async (req, res) => {
  const { mac, count } = req.params;
  try {
    const reports = await readEnergyReports(mac, parseInt(count));
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error retrieving energy reports:', error);
    res.status(500).json({ error: 'Failed to retrieve energy reports' });
  }
});

// Delete energy reports by ID
router.delete('/energyReports/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteEnergyReport(id); // Call the deleteEnergyReport function passing the ID
    res.status(200).json({ message: 'Energy report deleted successfully' });
  } catch (error) {
    console.error('Error deleting energy report:', error);
    res.status(500).json({ error: 'Failed to delete energy report' });
  }
});


// Create a new energy report
router.post('/energyReports', async (req, res) => {
  const { userId, mac, energyData } = req.body;
  try {
    await createEnergyReport(userId, mac, energyData);
    res.status(201).json({ message: 'Energy report saved successfully' });
  } catch (error) {
    console.error('Error saving energy report:', error);
    res.status(500).json({ error: 'Failed to save energy report' });
  }
});

module.exports = router;
