const express = require('express');
const config = require('config');
const app = express();
const reportsRouter= require('./routes/reports');





const { PORT = 3006 } = process.env;
app.listen(PORT, () => {
  console.log(`Energy Service is listening on port ${PORT}`);
});
