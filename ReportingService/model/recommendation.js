const cron = require('node-cron');
const config = require('config');
const axios = require('axios');
const { readEnergyReports } = require('../model/report');
const reg = require('../model/reg');
console.log('Recommander is here');

//30 5 13 * * *
//10 * * * 5 *
cron.schedule('*/5 * * * * *', async () => {
  console.log('schedule run ' + Date.now());
  try {



    var result = await getDeviceEnergyData('BK:85:P0:SA', 7);

    console.log(result);

    // predictedsumRGB: 780,
    // predictedSumYellow: 3650,
    // predictedSumWhite: 2628,
    // predictedSumEnergy: 7058,


  } catch (error) {
    console.error('Something Went wrong:', error.message);
  }
}, { scheduled: true });





const getDeviceEnergyData = async (mac, count) => {
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
  // console.log(sumEnergyList);
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
  //   console.log(sumWhiteList);
  const predictedSumWhite = reg.CalculatePredictedEnergy(sumWhiteList, parseInt(count) + 1);
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
  // console.log(sumYellowList);
  const predictedSumYellow = reg.CalculatePredictedEnergy(sumYellowList, parseInt(count) + 1);
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

  // console.log(sumRGBList);

  const predictedsumRGB = reg.CalculatePredictedEnergy(sumRGBList, parseInt(count) + 1);

  /// End of calculate SumRGB power
  var result = {
    predictedsumRGB,
    predictedSumYellow,
    predictedSumWhite,
    predictedSumEnergy,
    reports
  }
  return result;
}