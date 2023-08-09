const cron = require('node-cron');
const config = require('config');
const axios = require('axios');
const { createEnergyReport } = require('../model/report');
///api/ctrl
cron.schedule('*/10 * * * *', async () => {
    console.log('schedule run ' + Date.now());
    try {
        var result = await axios.get(config.DeviceServiceAddress + '/api/ctrl/GetAllDevices');
        var macAddresses = result.data.map(device => device.MacAddress);

        var promises = macAddresses.map(async (mac) => {
            try {
                var response = await axios.get(`${config.EnergyAddress}/api/report/energyUsageByDevice/${mac}/-24h`);
                if (response.data) {
                    await createEnergyReport(mac, response.data);
                    console.log('a new report is created for mac' + mac);
                }
            } catch (error) {
                console.error(error.message);
            }
        });

        await Promise.all(promises);

    } catch (error) {
        console.error('Error getting all devices:', error);
    }
}, { scheduled: false });




// {
//     "_id": {
//       "$oid": "64cb5c2a2de22b54c461fea8"
//     },
//     "userId": "sajad",
//     "mac": "BK:85:P0:SB",
//     "energy": {
//       "MacAddress": "BK:85:P0:SB",
//       "deviceModel": "IceRock-80W",
//       "driverYellowPower": "50",
//       "driverWhitePower": "50",
//       "driverRGBPower": "30",
//       "signalsCount": 19,
//       "RgbBrightnesslength": 19,
//       "whiteEnergyUsageAVG": 18.866315789473685,
//       "yellowEnergyUsageAVG": 4.701052631578947,
//       "rgbEnergyUsageAVG": 7.831578947368421,
//       "sumColorWhitePower": 716.9200000000001,
//       "sumColorYellowPower": 178.64,
//       "sumRGBPower": 148.8,
//       "sumAll": 1044.3600000000001
//     },
//     "CreateDateTime": {
//       "$date": "2023-08-03T07:50:02.402Z"
//     },
//     "__v": 0
//   }


// // Preprocess the data
// const data = {
//   "MacAddress": ["BK:85:P0:SB"],
//   "signalsCount": [19],
//   "whiteEnergyUsageAVG": [18.866315789473685],
//   "yellowEnergyUsageAVG": [4.701052631578947],
//   "rgbEnergyUsageAVG": [7.831578947368421],
//   "sumAll": [1044.3600000000001]
// };

// const df = {
//   "MacAddress": data.MacAddress,
//   "signalsCount": data.signalsCount,
//   "whiteEnergyUsageAVG": data.whiteEnergyUsageAVG,
//   "yellowEnergyUsageAVG": data.yellowEnergyUsageAVG,
//   "rgbEnergyUsageAVG": data.rgbEnergyUsageAVG,
//   "sumAll": data.sumAll
// };

// // Split the data
// const X = df.signalsCount.map((_, i) => [
//   df.signalsCount[i],
//   df.whiteEnergyUsageAVG[i],
//   df.yellowEnergyUsageAVG[i],
//   df.rgbEnergyUsageAVG[i]
// ]);

// const y = df.sumAll;

// // Train the model
// const regression = require('regression');
// const result = regression.linear(X, y);

// // Make predictions
// const X_test = [[19, 18.866315789473685, 4.701052631578947, 7.831578947368421]];
// const y_pred = result.predict(X_test);

// console.log("Predicted Energy Usage:", y_pred[0]);

// // Evaluate the model
// const actualValue = df.sumAll[0];
// const mse = (y_pred[0] - actualValue) ** 2;
// const rmse = Math.sqrt(mse);
// const mae = Math.abs(y_pred[0] - actualValue);

// console.log("Mean Squared Error:", mse);
// console.log("Root Mean Squared Error:", rmse);
// console.log("Mean Absolute Error:", mae);
