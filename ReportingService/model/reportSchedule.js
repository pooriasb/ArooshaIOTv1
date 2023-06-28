const cron = require('node-cron');
const config = require('config');

///api/ctrl
cron.schedule('*/10 * * * * *', async () => {
console.log('Running');
try {
  var result = await axios.get(config.DeviceServiceAddress + '/api/ctrl/GetAllDevices');
  console.log(result.data);
} catch (error) {
  console.error('Error getting all devices:', error);
}

}, { scheduled: true });
