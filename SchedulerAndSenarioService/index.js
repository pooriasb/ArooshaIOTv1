const express = require('express');
const app = express();

const scheduler = require('./routes/Scheduler');

app.use('/api/scheduler', scheduler);





const port = process.env.port || 3002;
app.listen(port, () => console.log(`SS Service is listening on port ${port}`));