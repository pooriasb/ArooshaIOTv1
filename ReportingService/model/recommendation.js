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
    calculateRGBEnergyUsage(result.predictedsumRGB, result.sumRGBList,50);
    calculateYellowEnergyUsage(result.predictedSumYellow, result.sumYellowList,50);
    calculateWhiteEnergyUsage(result.predictedSumWhite, result.sumWhiteList,50);

  } catch (error) {
    console.error('Something Went wrong:', error.message);
  }
}, { scheduled: true });

// offset means how much more energy i use to pull the trigger
const calculateRGBEnergyUsage = async (predictedSumYellow, sumRGBList,offset) => {
  if (sumRGBList.length > 0) {
    const lastItem = sumRGBList[sumRGBList.length - 1];
    if (lastItem.energy >= predictedSumYellow + offset) {
      //Send Notif
    }
  }
}
const calculateYellowEnergyUsage = async (predictedsumRGB, sumYellowList,offset) => {
  if (sumYellowList.length > 0) {
    const lastItem = sumYellowList[sumYellowList.length - 1];
    if (lastItem.energy >= predictedsumRGB + offset) {
      //Send Notif
    }
  }
}
const calculateWhiteEnergyUsage = async (predictedSumWhite, sumWhiteList,offset) => {
  if (sumWhiteList.length > 0) {
    const lastItem = sumWhiteList[sumWhiteList.length - 1];
    if (lastItem.energy >= predictedSumWhite + offset) {
      //Send Notif
    }
  }
}


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
    sumEnergyList,
    sumRGBList,
    sumWhiteList,
    sumYellowList,
    reports
  }
  return result;
}