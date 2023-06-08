const express = require('express');
const app = express();

const dbManager = require('./routes/dbManagement');
app.use(express.json());

app.post('/Alive', (req, res) => {
    const { userId, MAC, HUE, RGBBrightnes, ColorTemperature, Brightness, Dance } = req.body;
    dbManager.saveAliveSignal(userId, MAC, HUE, RGBBrightnes, ColorTemperature, Brightness, Dance);
    res.sendStatus(200);
});


app.get('/getSignalsByMac/:mac/:start', async (req, res) => {
  const mac = req.params.mac;
  const start = req.params.start || '-1d'; // Default to last day if start parameter is not provided

  try {
    const signals = await dbManager.getSignalByMac(mac, start);
    res.send(signals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching signals'); // Send error response to client
  }
});


//dbManager.getData();

const port = process.env.port || 3005;
app.listen(port, () => console.log(`influx Service is listening on port ${port}`));