const express = require('express');
const app = express();
var cron = require('node-cron');


const port = process.env.port || 3002;
app.listen(port, () => console.log(`SS Service is listening on port ${port}`));






/*************************Testing Node-Corn*************************** */

cron.schedule('*/1 * * * * *', () => {
    console.log('running a task every minute');
  },{scheduled:true});