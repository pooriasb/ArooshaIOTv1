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
  res.send('Hellow From Aoosha');
});
app.get('/a',(req,res)=>{
  res.status(418).send('Hellow');
});
// app.get('/.well-known/pki-validation/084E92B387799EDC05286B489F9A56D2.txt',(req,res)=>{
//   const filePath = `C:\\Users\\Administrator\\Desktop\\www\\ArooshaIOTv1\\ApiGateway\\Public\\084E92B387799EDC05286B489F9A56D2.txt`;
//   res.sendFile(filePath);
// });
// Export the app instance



module.exports = app;
