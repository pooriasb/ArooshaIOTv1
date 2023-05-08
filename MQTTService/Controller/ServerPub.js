const mqtt = require('mqtt');
var client;
function coonectToServer(address){
     client = mqtt.connect(address);
}
client.on("connect", function () {
    console.log(`ServerPub connected to broker .`);
});
function sendData(topic,message){
    client.publish(topic, message);
console.log('ServerPub: Data Sent');
}
module.exports = coonectToServer;
module.exports = sendData;

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