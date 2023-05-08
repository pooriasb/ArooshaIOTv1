const express = require('express');
const ServerPub = require('./Controller/ServerPub');
const ServerSub = require('./Controller/ServerSub');

const app = express();
const mqtt = require('mqtt');
var option = {
    clientId: '1PornHub',
    username: 'sajad',
    password: '369',
};

var topicName = 'SajadHome/Room1';

//var client = mqtt.connect('mqtt://127.0.0.1:1883');


// client.on("connect", function () {
//     console.log('connected to broker on 127.0.0.1:1883 .');

// });

// client.publish(topicName, 'Hello message first publish.');
// console.log(`publisher topic :${topicName}`);
/***********************Server connect end and start sendig message********************************* */

//send data to broker on a specific topic
app.get('/send/:data', (req, res) => {

    //ServerPub.coonectToServer('mqtt://127.0.0.1:1883');
    ServerPub.sendData(topicName, req.params.data);
    // client.publish(topicName, `test data sent from api:${req.params.data} `);
    console.log('data sent by index.js using serverpub.js');
    res.send('sent');
});


app.get('/subTopic', (req, res) => {
   console.log( ServerSub.getData(topicName));
   res.send('subscribed');
});



const port = process.env.port || 3001;
app.listen(port, () => console.log(`MQTT Service is listening on port ${port}`));


// client.on('message', (topic,message) => {
//     console.log(message + ' Topic: '+ topic);
// });





// client.on('reconnect', function () {
//     console.log('Reconnecting...')
// });
// client.on('close', function () {
//     console.log('Disconnected')
// });
// client.on('disconnect', function (packet) {
//     console.log(packet);
//     console.log('disconnected');
// });
// client.on('error', (e) => {
//     console.log('Error');
// });


