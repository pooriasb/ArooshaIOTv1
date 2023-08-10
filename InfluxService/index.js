const express = require('express');
const app = express();
const { InfluxDB } = require('@influxdata/influxdb-client')
const NodeCache = require('node-cache');

const dbManager = require('./routes/dbManagement');
app.use(express.json());

app.post('/Alive', async (req, res) => {
  try {

    const { userId, mac, hue, rgbBrightness, colorTemperature, brightness, dance } = req.body;
    await dbManager.saveAliveSignal(userId, mac, hue, rgbBrightness, colorTemperature, brightness, dance);
    res.sendStatus(200);
  }
  catch {
    console.error('Error saving alive signal:', error.message);
    res.status(500).send('Error saving alive signal');

  }
});

const signalCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
app.get('/getSignalsByMac/:mac/:start?', async (req, res) => {

  try {
    const mac = req.params.mac;
    const start = req.params.start || '-1d'; // Default to last day if start parameter is not provided
    const cacheKey = mac + '-' + start;

    // Check if the signals exist in cache
    const cachedSignals = signalCache.get(cacheKey);
    if (cachedSignals) {
      return res.send(cachedSignals);
    }


   
    const signals = await dbManager.getSignalByMac(mac, start);
   

    // Store the signals in cache
    signalCache.set(cacheKey, signals);

    res.send(signals);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error fetching signals'); // Send error response to client
  }
});


//dbManager.getData();

const port = process.env.port || 3005;
app.get('/pinger', (req, res) => { res.send(`Influx is ok `) });

app.listen(port, () => console.log(`influx Service is listening on port ${port}`));