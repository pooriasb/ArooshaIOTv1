const app = require('./app');
const cluster = require('cluster');
const os = require('os');
if (cluster.isMaster) {
  const cpuCount = os.cpus().length;

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
} else {
  const { PORT = 3000 } = process.env;
app.get('/pinger',(req,res)=>{res.send(`ApiGateWay is ok `)});

  app.listen(PORT, () => {
    console.log(`Api Gateway is listening on port: ${PORT}`);
  });
}



// const fs = require('fs');
// const https = require('https');
// const express = require('express');
// const cluster = require('cluster');
// const os = require('os');

// if (cluster.isMaster) {
//   const cpuCount = os.cpus().length;

//   for (let i = 0; i < cpuCount; i++) {
//     cluster.fork();
//   }
// } else {
//   const { PORT = 3000 } = process.env;
//   const options = {
//     key: fs.readFileSync('path/to/private/key.pem'),
//     cert: fs.readFileSync('path/to/certificate.pem')
//   };

//   const app = express();

//   app.get('/pinger', (req, res) => {
//     res.send('ApiGateWay is ok');
//   });

//   const server = https.createServer(options, app);

//   server.listen(PORT, () => {
//     console.log(`Api Gateway is listening on port: ${PORT}`);
//   });
// }





// const fs = require('fs');
// const https = require('https');
// const express = require('express');
// const cluster = require('cluster');
// const os = require('os');
// const { exec } = require('child_process');

// if (cluster.isMaster) {
//   const cpuCount = os.cpus().length;

//   for (let i = 0; i < cpuCount; i++) {
//     cluster.fork();
//   }
// } else {
//   const { PORT = 3000 } = process.env;

//   // Generate self-signed SSL certificates using OpenSSL
//   exec('openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out certificate.pem -days 365 -subj "/CN=example.com"');

//   const options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('certificate.pem')
//   };

//   const app = express();

//   app.get('/pinger', (req, res) => {
//     res.send('ApiGateWay is ok');
//   });

//   const server = https.createServer(options, app);

//   server.listen(PORT, () => {
//     console.log(`Api Gateway is listening on port: ${PORT}`);
//   });
// }
