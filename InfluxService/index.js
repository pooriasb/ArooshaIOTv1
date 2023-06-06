const express = require('express');
const app = express();

const dbManager = require('./routes/dbManagement');


app.post('/Alive', (req, res) => {
    const { userId, MAC, HUE, RGBBrightnes, ColorTemperature,Brightness,Dance } = req.body;

    dbManager.saveAliveSignal(userId,MAC,HUE,RGBBrightnes,ColorTemperature,Brightness,Dance);
    res.sendStatus(200);
});

const port = process.env.port || 3005;
app.listen(port, () => console.log(`influx Service is listening on port ${port}`));