const express = require('express');
const config = require('config');
const app = express();
const reportsRouter= require('./routes/reports');
const powerSupplyRouter = require('./models/powerSupply');
const limitRouter = require('./routes/limitReport');
app.use('/api/report',reportsRouter);
app.use('/api/limit',limitRouter);
app.use('/api/power',powerSupplyRouter);


const { PORT = 3006 } = process.env;
app.get('/pinger',(req,res)=>{res.send(`Energy is ok `)});

app.listen(PORT, () => {
  console.log(`Energy Service is listening on port ${PORT}`);
});
