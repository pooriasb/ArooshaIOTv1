const express = require('express');
const app = express();
const server = require('http').Server(app);
const sms = require('./routes/sms');



app.get('/sendSMS/:phone/:message', (req, res) => {
    var result = sms.sendSms(req.params.message, req.params.phone);
    res.send(result);
});


const { PORT = 3010 } = process.env;
app.get('/pinger', (req, res) => { res.send(`notification is ok `) });

server.listen(PORT, () => {
    console.log(`notification Service is listening on port ${PORT}`);
});
