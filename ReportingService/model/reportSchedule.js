const cron = require('node-cron');
const config = require('config');
const axios = require('axios');
const { createEnergyReport } = require('../model/report');
///api/ctrl
cron.schedule('*/10 * * * * *', async () => {
    console.log('Running');
    try {
        var result = await axios.get(config.DeviceServiceAddress + '/api/ctrl/GetAllDevices');
        var macAddresses = result.data.map(device => device.MacAddress);

        for (let mac of macAddresses) {
            try {
                var response = await axios.get(`${config.EnergyAddress}/api/report/energyUsageByDevice/${mac}/:start-24h`);
                if (response.data) {
                    createEnergyReport(mac, response.data);

                }
            } catch (error) {
                console.error(error);
            }
        }


    } catch (error) {
        console.error('Error getting all devices:', error);
    }
}, { scheduled: true });
