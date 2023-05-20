const mqtt = require('mqtt');
const config = require('config');


var client = mqtt.connect(config.mqttAddress);
client.on("connect", function () {
    console.log(`ServerSub connected to broker .`+ config.mqttAddress);
});


function  getData(topic) {
   
}
client.subscribe('ArooshaIOT/#');
client.on('message', (topic,message) => {
    console.log('serverSu Message: ' + message + ' Topic: ' + topic );
});
module.exports.getData = getData;
/***********************Status Manager */
client.on('reconnect', () => {
    console.log('ServerSub Reconnecting...')
  });
  
  client.on('close', () => {
    console.log('ServerSub Disconnected')
  });
  
  client.on('disconnect', (packet) => {
    console.log(packet);
    console.log(' ServerSub disconnected');
  });
  
  client.on('error', (error) => {
    console.error('ServerSub Error:', error);
  });