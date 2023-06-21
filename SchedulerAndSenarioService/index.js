const express = require('express');
const app = express();
const SchedulerRouter = require('./routes/Scheduler');
const senarioRouter = require('./routes/senario');
app.use('/api/scheduler', SchedulerRouter);
app.use('/api/senario', senarioRouter);


const port = process.env.port || 3002;
app.listen(port, () => console.log(`SS Service is listening on port ${port}`));