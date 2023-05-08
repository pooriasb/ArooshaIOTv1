const mqtt = require('mqtt');
var client;
function coonectToServer(address) {
    client = mqtt.connect(address);
}
client.on("connect", function () {
    console.log(`ServerSub connected to broker .`);
});
function  getData(topic) {
    client.subscribe(topic);
    client.on('message', (topic, message) => {
        return message + ' Topic: ' + topic;
    });

}
module.exports = coonectToServer;
module.exports = getData;

client.on('reconnect', function () {
    console.log('ServerSub Reconnecting...')
});
client.on('close', function () {
    console.log('ServerSub Disconnected')
});
client.on('disconnect', function (packet) {
    console.log(packet);
    console.log(' ServerSub disconnected');
});
client.on('error', (e) => {
    console.log('ServerSub Error');
});