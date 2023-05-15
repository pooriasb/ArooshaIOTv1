// this file work as service gateway
const express = require('express');
const app = express();







const port = process.env.port || 3003;
app.listen(port, () => console.log(`Device Service is listening on port ${port}`));