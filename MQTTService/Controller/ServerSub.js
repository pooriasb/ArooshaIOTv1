const mqtt = require('mqtt');
const config = require('config');


var client = mqtt.connect(config.mqttAddress);
client.on("connect", function () {
    console.log(`ServerSub connected to broker .`+ config.mqttAddress);
});


function  getData(topic) {
    client.subscribe(topic);
    client.on('message', (topic, message) => {
        console.log('serverSu Message: ' + message + ' Topic: ' + topic );
        return message + ' Topic: ' + topic;
    });
}

module.exports.getData = getData;

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