const express = require('express');
const config = require('config');
const app = express();
const reportsRouter= require('./routes/reports');

app.use('/api/report',reportsRouter);



