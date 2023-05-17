const express = require('express');
const schedule = require('./routes/schedule');

const config = require('config');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('Public'))
app.use('/api/schedule',schedule);


