const mqtt = require('mqtt');
const config = require('config');


var client = mqtt.connect(brokerAddress);
client.on("connect", function () {
    console.log(`ServerPub connected to broker .` + brokerAddress);
});



function sendData(topic, message) {
    client.publish(topic, message);
    console.log('ServerPub: Data Sent');

}
module.exports = coonectToServer;
module.exports = sendData;
exports.brokerAddress;

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