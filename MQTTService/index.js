const express = require('express');
const ServerPub = require('./Controller/ServerPub');
const ServerSub = require('./Controller/ServerSub');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
const mqtt = require('mqtt');
var option = {
    clientId: '1PornHub',
    username: 'sajad',
    password: '369',
};

var topicName = 'ArooshaIOT/#';

//var client = mqtt.connect('mqtt://127.0.0.1:1883');


// client.on("connect", function () {
//     console.log('connected to broker on 127.0.0.1:1883 .');

// });

// client.publish(topicName, 'Hello message first publish.');
// console.log(`publisher topic :${topicName}`);
/***********************Server connect end and start sendig message********************************* */

//send data to broker on a specific topic
app.get('/send/:data/:topic', (req, res) => {
    //ServerPub.coonectToServer('mqtt://127.0.0.1:1883');
    ServerPub.sendData(topicName, req.params.data);
    // client.publish(topicName, `test data sent from api:${req.params.data} `);
    console.log('data sent by index.js using serverpub.js');
    res.send('sent');
});


/*
This code creates a POST route at /SendSchedulerData that takes in a request req and response res object. First, the request body is retrieved using req.body and assigned to a constant messages.
Next, there is a nested loop that iterates through each item in each object in messages. On each iteration, it retrieves the deviceMac and eventid properties and assigns them to constants. Finally, it uses ServerPub.sendData to send a message containing the deviceMac and eventid to the server and logs it to the console if needed.
After all messages have been sent, the server responds with a status code of 200 using res.sendStatus(200).
 */
// app.post('/SendSchedulerData',(req,res) =>{
// const messages = req.body
// for (let key in messages) {
//     for (let i=0; i<messages[key].length; i++) {
//       const deviceMac = messages[key][i].deviceMac;
//       const eventId = messages[key][i].eventid;
//       ServerPub.sendData(key,`Device Mac: ${deviceMac}, Event Id: ${eventId}`);
//      //console.log(`Device Mac: ${deviceMac}, Event Id: ${eventId}`);
//     }
//   }
// res.sendStatus(200);
// });

app.post('/SendSchedulerData', (req, res) => {
    const { body: messages } = req;
    for (const key in messages) {
      for (let i = 0; i < messages[key].length; i++) {
        const { deviceMac, eventid: eventId } = messages[key][i];
        ServerPub.sendData(key, `Device Mac: ${deviceMac}, Event Id: ${eventId}`);
      }
    }
    res.sendStatus(200);
  });
  


app.get('/subTopic', (req, res) => {
  ServerSub.getData(topicName);
   res.send('subscribed');
});
const port = process.env.port || 3001;
app.get('/pinger',(req,res)=>{res.send(`MQTT is ok `)});

app.listen(port, () => console.log(`MQTT Service is listening on port ${port}`));



function compileSchedulerData(Data){
    // for (let index = 0; index < Data.length; index++) {
    //     const element = Data[index];
    //     console.log(element);
    // } 
    
    console.log(Data);
}