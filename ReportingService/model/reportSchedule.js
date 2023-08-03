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
}, { scheduled: true });

