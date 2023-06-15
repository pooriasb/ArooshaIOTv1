const express= require('express');
const app = express();
const apiRouter = require('./routes/apiGateway');
const authRouter = require('./routes/auth');
const deviceRouter = require('./routes/device');
const energyRouter = require('./routes/energy');
const mqttRouter = require('./routes/mqtt');
const schedulerRouter = require('./routes/scheduler');
const socketRouter = require('./routes/socket');



app.use('/apiGateway',apiRouter);
app.use('/auth',authRouter);
app.use('/device',deviceRouter);
app.use('/energy',energyRouter);
app.use('/scheduler',schedulerRouter);
app.use('/scheduler',schedulerRouter);
app.use('/socket',socketRouter);
app.use('/mqtt',mqttRouter);








// run server
const { PORT = 3007 } = process.env;
app.listen(PORT, () => {
  console.log(`Api Gateway is listening on port ${PORT}`);
});
