const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.dbAddress)
  .then(() => console.log('Connected to database'))
  .catch(err => console.log('Error ' + err));



const EnergyReportSchema = new mongoose.Schema({
  userId: String,
  CreateDateTime: { type: Date, default: Date.now },
  mac: { type: String, required: true },
  energy: {
    type: Object,
    required: true
  }
});

const EnergyReport = mongoose.model('EnergyReport', EnergyReportSchema);

async function readEnergyReports(mac, count) {
  try {
    const reports = await EnergyReport.find({ mac: mac }).sort({ CreateDateTime: -1 }).limit(count);

 

    return reports;
  } catch (error) {
    console.error('Error retrieving energy reports:', error);
  }
}

async function deleteEnergyReport(id) {
  try {
    await EnergyReport.findByIdAndDelete(id);
    console.log('Energy report deleted successfully');
  } catch (error) {
    console.error('Error deleting energy report:', error);
  }
}

async function createEnergyReport(mac, energyData) {
  try {
    const energyReport = new EnergyReport({
      userId: 'sajad',
      mac: mac,
      energy: energyData
    });

    await energyReport.save();
    console.log('Energy report saved successfully');
    return energyReport;
  } catch (error) {
    console.error('Error saving energy report:', error.message);
    return error.message;
  }
}


module.exports = {
  readEnergyReports,
  deleteEnergyReport,
  createEnergyReport
}