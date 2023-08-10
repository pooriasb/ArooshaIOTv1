const express = require('express');
const deviceControllrouter = require('./routes/deviceController');
const scheduleRouter = require('./routes/schedule');
const authRouter = require('./routes/auth');
const senarioRouter = require('./routes/senario');
const energyRouter = require('./routes/energyReports');
const limitRouter = require('./routes/limit');
const powerRouter = require('./routes/powerSupply');
const reportsRouter = require('./routes/report');
const cors = require('cors');
var geoip = require('geoip-lite');
const config = require('config');
const app = express();


// CORS configuration
// const corsOptions = {
//   origin: '*',
//   methods: ['GET', 'POST','PATCH' , 'DELETE']
// };
// app.use(cors(corsOptions));
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
app.use(express.static('Public'))
// app.use('/api/schedule',schedule);
app.use('/api/device',deviceControllrouter);
app.use('/api/schedule',scheduleRouter);
app.use('/api/auth',authRouter);
app.use('/api/senario',senarioRouter);
app.use('/api/energy',energyRouter);
app.use('/api/limit',limitRouter);
app.use('/api/power',powerRouter);
app.use('/api/report',reportsRouter);
app.get('/',(req,res)=>{
  
  var ip = req.ip;
  var geo = geoip.lookup(ip);
  res.status(418).send('Hellow From Aoosha yourIp : ' + geo);
});
module.exports = app;
