const express = require('express');
const app = express();

const dbManager = require('./routes/dbManagement');
app.use(express.json());

app.post('/Alive', (req, res) => {
    const { userId, mac, hue, rgbBrightness, colorTemperature, brightness, dance } = req.body;
    dbManager.saveAliveSignal(userId, mac, hue, rgbBrightness, colorTemperature, brightness, dance);
    res.sendStatus(200);
});


app.get('/getSignalsByMac/:mac/:start', async (req, res) => {
  const mac = req.params.mac;
  const start = req.params.start || '-1d'; // Default to last day if start parameter is not provided

  try {
    console.time('getSignal');
    const signals = await dbManager.getSignalByMac(mac, start);
    console.timeEnd('getSignal');

    res.send(signals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching signals'); // Send error response to client
  }
});


//dbManager.getData();

const port = process.env.port || 3005;
app.get('/pinger',(req,res)=>{res.send(`Influx is ok `)});

app.listen(port, () => console.log(`influx Service is listening on port ${port}`));