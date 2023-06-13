const express= require('express');
const app = express();
const apiRouter = require('./routes/apiGateway');

app.use('/apiGateway',apiRouter);


// run server
const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`Api Gateway is listening on port ${PORT}`);
});
