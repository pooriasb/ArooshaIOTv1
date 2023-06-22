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
