const mqtt = require('mqtt');
const config = require('config');


var client = mqtt.connect(config.mqttAddress);
client.on("connect", function () {
    console.log(`ServerPub connected to broker .`+ config.mqttAddress);
});


function sendData(topic, message) {
    client.publish(topic, message);
    console.log('ServerPub: Data Sent');

}

module.exports.sendData = sendData;

client.on('offline', function () {
    console.log('offline')
  })
client.on('reconnect', function () {
    console.log('ServerPub Reconnecting...')
});
client.on('close', function () {
    console.log('ServerPub Disconnected')
});
client.on('disconnect', function (packet) {
    console.log(packet);
    console.log(' ServerPub disconnected');
});
client.on('error', (e) => {
    console.log('ServerPub Error');
});