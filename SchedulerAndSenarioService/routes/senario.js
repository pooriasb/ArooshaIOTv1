
const express = require('express');
const router = express.Router();
const senario = require('../models/senarioModel');
const config = require('config');
const io = require('socket.io-client');
const socket = io(config.SocketAddress);//SocketAddress
const _ = require('lodash');
const http = require('http');


router.use(express.json());

router.post('/updateSenario', async (req, res) => {
  const { name, eventList, senarioId } = req.body;
  try {
    const updatedSenario = await updateSenario(senarioId, { name: name, eventList: eventList });
    return res.send(updatedSenario);
  } catch (error) {
    console.error('Error updating senario:', error.message);
    return res.status(500).send('An error occurred while updating the senario.');
  }
});
router.post('/createSenario', async (req, res) => {
    try {

        const {name,eventList} = req.body;
        var data = {userId : 'sajad',name,eventList}
        const result = await senario.createSenario(data); 
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

router.get('/deleteSenario/:senarioId', async (req, res) => {
    try {
        const result = await senario.deleteSenario(req.params.senarioId);
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
router.get('/scenario/:senarioId', async (req, res) => {
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

router.post('/startSenario', async (req, res) => {
  try {
    const { senarioId } = req.body;
    const scenario = await senario.readScenario(senarioId);
    const eventListIndb = scenario.eventList;
    const messageList = [];

    for (const event of eventListIndb) {
      const singleMessageCreated = await createMessage(event);
      messageList.push(singleMessageCreated);
    }

    if (messageList.length !== 0) {
      const result = await sendToSocketService(messageList);
      return res.status(result).send('Message sent successfully.');
    } else {
      return res.status(400).send('No messages to send.');
    }
  } catch (error) {
    console.error('Error sending message to socket service:', error.message);
    return res.status(500).send('An error occurred while sending messages.');
  }
});




function sendToSocketService(messageList) {
  try {
    var grouped = _.mapValues(_.groupBy(messageList, 'deviceTopic'), mList =>
      mList.map(message => _.omit(message, 'deviceTopic'))
    );
    socket.on('connect', () => {
      console.log('Connected to socket server!');
    });
    socket.emit('request', { message: grouped, type: 'S' });
    return 200
  } catch (error) {
    console.error('Error sending message to socket service:', error.message);
    return 500
  }
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
