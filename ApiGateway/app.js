const express = require('express');
const deviceControllrouter = require('./routes/deviceController');
const scheduleRouter = require('./routes/schedule');
const authRouter = require('./routes/auth');
const cors = require('cors');

const config = require('config');
const app = express();


// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST']
};
app.use(cors(corsOptions));

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
app.use(express.static('Public'))
// app.use('/api/schedule',schedule);
app.use('/api/device',deviceControllrouter);
app.use('/api/schedule',scheduleRouter);
app.use('/api/auth',authRouter);
app.get('/',(req,res)=>{
  res.send('Hellow From Aoosha');
});
// Export the app instance
module.exports = app;
