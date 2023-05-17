const express = require('express');
const app = express();
const SchedulerRouter = require('./routes/Scheduler');
app.use('/api/scheduler', SchedulerRouter);


const port = process.env.port || 3002;
app.listen(port, () => console.log(`SS Service is listening on port ${port}`));