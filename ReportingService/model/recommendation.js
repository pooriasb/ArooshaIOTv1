const cron = require('node-cron');
const config = require('config');
const axios = require('axios');
const { readEnergyReports } = require('../model/report');
//30 5 13 * * *
cron.schedule('10 * * * * *', async () => {
    console.log('schedule run ' + Date.now());
    try {
       
    } catch (error) {
        console.error('Error getting all devices:', error);
    }
}, { scheduled: true });