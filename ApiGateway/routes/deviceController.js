const express = require('express');
const router = express.Router();
const config = require('config');

const axios = require('axios');
//const { route } = require('./deviceController');
router.use(express.json());
router.post('/sendMessage', async (req, res) => {
    try {
        console.clear();
        const mac = req.body.MacAddress;
        const powerstatus = req.body.powerStatus;
        if (!mac || !powerstatus) return res.status(400).send('Mac or power status not valid');
        const newMessage = req.body;
        // get last message saved in database 
        const logResponse = await axios.get(`${config.LogAddress}/api/log/getLastMessage/${mac}`);
        const lastMessage = logResponse.data;
        console.log('new message recived:');
        console.log(newMessage);
        // complete new message with missing parameters using last message's parameters
        const lastCustomization = lastMessage.deviceCustomization;
        const newCustomization = newMessage.deviceCustomization;

        const completedMessage = {
            MacAddress: mac,
            powerStatus: powerstatus,
            protocol: newMessage.protocol || lastMessage.protocol,
            deviceCustomization: {
                ...lastCustomization,
                ...newCustomization
            }
        };

        const response = await axios.post(`${config.SocketAddress}/sendMessage`, {
            mac: mac,
            powerStatus: powerstatus,
            message: completedMessage
        });
        console.log('completeMessage: ' + completedMessage);

        console.log('socket Response : ' + response.data);
        res.status(200).send(completedMessage);
    } catch (error) {
        console.error('error in send message ');
        res.status(500).send({ error: 'send message Internal Server Error' });
    }
});
router.post('/sendMessageToRoom', async (req, res) => {
    try {
        console.clear();
        const roomId = req.body.roomId;
        const powerstatus = req.body.powerStatus;
        const newMessage = req.body;
        const response = await axios.get(config.DeviceServiceAddress + '/api/room/getDevicesInRoomByRoomId/' +roomId);
        const devices = response.data.devices.map(device => device.MacAddress);
    
        const energyResult = await Promise.all(devices.map(async mac => {
           
            // get last message saved in database 
            const logResponse = await axios.get(`${config.LogAddress}/api/log/getLastMessage/${mac}`);
            const lastMessage = logResponse.data;
        
            // complete new message with missing parameters using last message's parameters
            const lastCustomization = lastMessage.deviceCustomization;
            const newCustomization = newMessage.deviceCustomization;
    
            const completedMessage = {
                MacAddress: mac,
                powerStatus: powerstatus,
                protocol: newMessage.protocol || lastMessage.protocol,
                deviceCustomization: {
                    ...lastCustomization,
                    ...newCustomization
                }
            };
    
            const response = await axios.post(`${config.SocketAddress}/sendMessage`, {
                mac: mac,
                powerStatus: powerstatus,
                message: completedMessage
            });
        }));
        res.status(200).send('sent');

    } catch (error) {
        console.error('error in send message '+ error.message);
        res.status(500).send({ error: 'send message Internal Server Error'+error.message });
    }
});

router.get('/getLastMessage/:mac', async (req, res) => {
    try {
        const logResponse = await axios.get(`${config.LogAddress}/api/log/getLastMessage/${req.params.mac}`);
        return res.send(logResponse.data);
    } catch (error) {
        console.error(`APIGATEWAY-Error reading last message`);
        return res.status(500).send("APIGATEWAY-Error occurred while retrieving last message");
    }
});

/***************************************************Device Management  */

router.get('/getMyDeviceList/:userId', async (req, res) => {
    try {
        let [deviceList, roomList] = await Promise.all([
            getMyDeviceListFromService(req.params.userId),
            sendGetMyRoomListToservice(req.params.userId),

        ]);

        /// for each device in deviceList get mac and pass to getDeviceStatus
        const deviceListWithStatus = await Promise.all(deviceList.map(async (device) => {
            return {
                ...device,
                status: await getDeviceStatus(device.MacAddress) || 'off'
            };
        }));
        deviceList = deviceListWithStatus;
        res.json({ deviceList, roomList });
    } catch (error) {
        console.log('Error:  ' + error);
        res.status(500).json({ error: error.message });
    }
});

async function getDeviceStatus(macAddress) {
    try {
        const response = await axios.get(`${config.LogAddress}/api/log/getLastMessage/${macAddress}`);

        return response.data.powerStatus;
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return 'error';
    }
}


async function getMyDeviceListFromService(userId) {
    try {
        const response = await axios.get(`${config.DeviceServiceAddress}/api/ctrl/list/${userId}`);
        return response.data;
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return 'error';
    }
}
router.get('/getDeviceByMac/:mac', async (req, res) => {
    try {
        const result = await axios.get(config.DeviceServiceAddress + '/api/ctrl/getDeviceByMac/' + req.params.mac);
        res.send(result.data);
    } catch (error) {
        res.status(error.response.status).send(error.response.data);
    }
});

router.get('/isDeviceCreated/:mac', async (req, res) => {
    try {
        const result = await axios.get(config.DeviceServiceAddress + '/api/ctrl/getDeviceByMac/' + req.params.mac);
        if (result.data) {
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
        }
    } catch (error) {
        res.status(error.response.status).send(error.response.data);
    }
});


router.get('/CreateDevice/:userId/:deviceName/:deviceModel/:Topic/:MacAddress', (req, res) => {
    //TODO: validation 
    sendCreateRequestToService();
    res.sendStatus(200);
});
function sendCreateRequestToService(device) {
    const data = {
        userId: device.userId,
        deviceName: device.deviceName,
        deviceModel: device.deviceModel,
        topic: device.topic,
        macAddress: device.macAddress
    };
    return axios.post(config.DeviceServiceAddress + '/api/ctrl/createDevice', data);
}

router.post('/updateDeviceName', async (req, res) => {
    try {
        const { deviceId, newDeviceName } = req.body;

        const response = await axios.post(config.DeviceServiceAddress + '/api/ctrl/updateDeviceName/', { deviceId, newDeviceName });

        if (response.data) {
            return res.status(200).send(response.data);
        } else {
            throw new Error('Error updating device name');
        }
    } catch (error) {
        console.error('Error updating device name:', error);
        return res.status(500).send('Error updating device name');
    }
});


router.get('/DeleteDevice/:mac', (req, res) => {
    res.send(sendDeleteRequestToService(req.params.mac));
});
function sendDeleteRequestToService(mac) {
    axios.get(config.DeviceServiceAddress + '/api/ctrl/delete/' + mac)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return "-1";
        });
}

router.get('/GetDevicesInRoom/:roomName', async (req, res) => {
    try {
        const response = await axios.get(config.DeviceServiceAddress + '/api/ctrl/getDevicesInRoom/' + req.params.roomName);
        res.status(200).send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send([]);
    }
});


/************************************************************ */
/*********************************Room Management */
router.get('/GetMyRoomList/:userId', async (req, res) => {

    var response = await sendGetMyRoomListToservice(req.params.userId);
    res.send(JSON.stringify(response));
});

async function sendGetMyRoomListToservice(userId) {
    try {

        const response = await axios.get(config.DeviceServiceAddress + '/api/room/list/' + userId);

        return response.data;
    } catch (error) {
        return "-1";
    }
}

router.post('/CreateRoom', (req, res) => {
    try {
        const { roomName } = req.body;
        console.log(roomName);
        axios.post(config.DeviceServiceAddress + '/api/room/create', { roomName })
            .then(response => {
                res.sendStatus(200);
            })
            .catch(error => {
                // handle error
                console.log(error);
                res.status(500).send('request to device service faild');

            });
    } catch (error) {
        // Replace with appropriate error handling mechanism
        console.error(error);
        res.status(500).send('Failed to create room');
    }

});
router.get('/DeleteRoom/:roomId', async (req, res) => {
    const response = await axios.get(config.DeviceServiceAddress + '/api/room/delete/' + req.params.roomId);

    res.status(200).send(response.data);
});
router.get('/updateRoom', (req, res) => {
    res.sendStatus(200);
});
router.post('/updateRoomName', async (req, res) => {
    try {

        const { roomName, roomId } = req.body
        const response = await axios.post(config.DeviceServiceAddress + '/api/room/updateName/', {
            roomName,
            roomId
        });
        res.status(200).send(response.data);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send('Error updating room name');
    }
});

//removeDeviceFromRoom

router.get('/getDevicesInRoomByRoomName/:roomName', async (req, res) => {
    var response = await axios.get(config.DeviceServiceAddress + '/api/ctrl/getDevicesInRoomByRoomName/' + req.params.roomName);
    res.status(200).json(response.data);
});
router.get('/getDevicesInRoomByRoomId/:roomId', async (req, res) => {
    var response = await axios.get(config.DeviceServiceAddress + '/api/room/getDevicesInRoomByRoomId/' + req.params.roomId);
    res.status(200).json(response.data);
});
router.post('/AddDevicetoRoom', (req, res) => {
    try {
        const { roomId, deviceMac } = req.body;

        axios.get(config.DeviceServiceAddress + '/api/room/addDeviceToRoom/' + roomId + '/' + deviceMac)
            .then(response => {
                res.status(200).send(response.data);
            })
            .catch(error => {
                // handle error
                console.log(error);
                res.sendStatus(500);
            });
    } catch (error) {
        // Replace with appropriate error handling mechanism
        console.error(error);
        res.status(500).send('Failed to create room');
    }
});


router.get('/removeDeviceFromRoom/:roomId/:deviceMac', (req, res) => {
    try {
        const { roomId, deviceMac } = req.params;
        axios.get(config.DeviceServiceAddress + '/api/room/removeDeviceFromRoom/' + roomId + '/' + deviceMac)
            .then(response => {
                res.status(200).send(response.data);
            })
            .catch(error => {
                // handle error
                console.log(error);
                res.sendStatus(500);
            });
    } catch (error) {
        // Replace with appropriate error handling mechanism
        console.error(error);
        res.status(500).send('Failed to create room');
    }
});
/************************************************** */


module.exports = router;