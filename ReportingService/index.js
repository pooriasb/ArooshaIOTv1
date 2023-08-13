const express = require('express');
const app = express();
const server = require('http').Server(app);
const report = require('./routes/reportRouter');
const reportSchedule = require('./model/reportSchedule');
const Recommander = require('./model/recommendation');
app.use(express.json());
app.use('/api/report', report);

const { PORT = 3011 } = process.env;
app.get('/pinger', (req, res) => { res.send(`Report is ok `) });

server.listen(PORT, () => {
    console.log(`Report Service is listening on port ${PORT}`);
});
