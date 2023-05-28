const express = require('express');
const deviceControllrouter = require('./routes/deviceController');
const scheduleRouter = require('./routes/schedule');
const config = require('config');
const app = express();

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
 app.use(express.static('Public'))
// app.use('/api/schedule',schedule);


 app.use('/api/device',deviceControllrouter);
 app.use('/api/schedule',scheduleRouter);



const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`Api Gateway is listening on port ${PORT}`);
});
