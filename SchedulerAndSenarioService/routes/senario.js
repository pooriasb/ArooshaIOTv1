
const express = require('express');
const router = express.Router();
const senario = require('../models/senarioModel');
const config = require('config');
const io = require('socket.io-client');
const socket = io(config.SocketAddress);//SocketAddress
const _ = require('lodash');
const http = require('http');
router.post('/createSenario', async (req, res) => {
    try {
        const result = await senario.createSenario(req.body); // assuming the request body contains the necessary data
        if (result === "1") {
            res.status(200).send('Senario created successfully');
        } else {
            res.status(500).send('Error creating senario');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating senario');
    }
});

router.get('/deleteSenario/:userId', async (req, res) => {
    try {
        const result = await senario.deleteSenario(req.params.userId); // assuming the user id is passed as a param in the URL
        if (result === "1") {
            res.status(200).send('Senario deleted successfully');
        } else {
            res.status(500).send('Error deleting senario');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting senario');
    }
});

router.get('/scenarios/:userId', async (req, res) => {
    try {
        const result = await senario.readScenarios(req.params.userId); // assuming the user id is passed as a param in the URL
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error getting scenarios');
    }
});
app.get('/scenario/:senarioId', async (req, res) => {
    try {
        const senarioId = req.params.senarioId;
        const result = await senario.readScenario(senarioId);

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error getting scenario');
    }
});

let messageList = [];

app.post('/startSenario', async (req, res) => {
    const { senarioId } = req.body;
     await senario.readScenario(senarioId).then((value)=>{
        // we have to send senario into socket service
        var eventListIndb = value.eventList;
        eventListIndb.forEach(async (element) => {
            await createMessage(element).then(singleMessageCreated => {
                addToMEssageList(singleMessageCreated)
            });
        });
        if (messageList.length !== 0) {
       
            //sendToMqttService(messageList);
            sendToSocketService(messageList);
        }
        messageList = [];
     });

});
function sendToSocketService(messageList){
    var grouped = _.mapValues(_.groupBy(messageList, 'deviceTopic'), mList => mList.map(message => _.omit(message, 'deviceTopic')));
    socket.on('connect', () => {
        console.log('Connected to socket server!');
      });
      socket.emit('request', {message:grouped,type :'S'});
}
function addToMEssageList(message) {
    messageList.push(message);
}
async function createMessage(element) {
    const deviceTopic = await getTopic(element.deviceId);
    const deviceMac = `${await getTMac(element.deviceId)}${Math.floor(Math.random() * 100) + 1}`;
    const message = { deviceTopic, deviceMac, eventid: element.eventId };
    return message;
}
function getTMac(deviceId) {
    return new Promise((resolve, reject) => {
        http.get(config.DeviceServiceAddress + '/GetDeviceMac/' + deviceId, resp => {
            let data = '';
            resp.on('data', chunk => data += chunk);
            resp.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
}
function getTopic(deviceId) {
    return p = new Promise((resolve, reject) => {

        http.get(config.DeviceServiceAddress + '/GetDeviceTopic/' + deviceId, (resp) => {
            let data = "";

            // A chunk of data has been recieved.
            resp.on("data", chunk => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on("end", () => {
                //    let url = JSON.parse(data).message;

                resolve(data);
            });
        }).on("error", err => {
            console.log("Error: " + err.message);
        });
    });
}

module.exports = router;
