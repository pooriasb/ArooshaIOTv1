const express = require('express');
const router = express.Router();
const {
  readEnergyReports,
  deleteEnergyReport,
  createEnergyReport
} = require('../model/report');
const reg = require('../model/reg');
// Get energy reports for a specific MAC address
router.get('/energyReports/:mac/:count', async (req, res) => {
  const { mac, count } = req.params;
  try {
    const reports = await readEnergyReports(mac, parseInt(count));

    // calculate sum Energy
    const sumEnergyList = reports.reduce((accumulator, report, index) => {
      if (report.energy.sumAll !== 0) {
        accumulator.push({
          time: index + 1,
          energy: report.energy.sumAll
        });
      }
      return accumulator;
    }, []);
    console.log(sumEnergyList);
    var predictedSumEnergy = reg.CalculatePredictedEnergy(sumEnergyList, parseInt(count) + 1);
    /// End of calculate sum Energy

    /// calculate SumWhite power
    const sumWhiteList = reports.reduce((accumulator, report, index) => {
      if (report.energy.sumColorWhitePower !== 0) {
        accumulator.push({
          time: index + 1,
          energy: report.energy.sumColorWhitePower
        });
      }
      return accumulator;
    }, []);
    console.log(sumWhiteList);
    var predictedSumWhite = reg.CalculatePredictedEnergy(sumWhiteList, parseInt(count) + 1);
    /// End of calculate SumWhite power

    /// calculate SumYellow power
    const sumYellowList = reports.reduce((accumulator, report, index) => {
      if (report.energy.sumColorYellowPower !== 0) {
        accumulator.push({
          time: index + 1,
          energy: report.energy.sumColorYellowPower
        });
      }
      return accumulator;
    }, []);
    console.log(sumYellowList);
    var predictedSumYellow = reg.CalculatePredictedEnergy(sumYellowList, parseInt(count) + 1);
    /// End of calculate SumYellow power
    /// calculate SumRGB power
    const sumRGBList = reports.reduce((accumulator, report, index) => {
      if (report.energy.sumRGBPower !== 0) {
        accumulator.push({
          time: index + 1,
          energy: report.energy.sumRGBPower
        });
      }
      return accumulator;
    }, []);
    console.log(sumRGBList);
    var predictedsumRGB = reg.CalculatePredictedEnergy(sumRGBList, parseInt(count) + 1);
    /// End of calculate SumRGB power


    var result = {
      predictedsumRGB,
      predictedSumYellow,
      predictedSumWhite,
      predictedSumEnergy,
      reports

    }

    res.status(200).json(result);
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
