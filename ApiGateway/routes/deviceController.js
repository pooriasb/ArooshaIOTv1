const express = require('express');
const router = express.Router();
const config = require('config');
//const { authMiddleware } = require('../middleware/auth');
const axios = require('axios');
//const { route } = require('./deviceController');
router.use(express.json());


const checkAuth = async (req, res, next) => {
    const { token } = req.headers;
    console.clear();
    console.log('client IP : ' + req.ip);
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {

        var validateTokenResult = await axios.post(config.AuthAddress + `/api/auth/validateToken`, { token: token });
        console.log('token validation result:' + validateTokenResult.data);
        if (validateTokenResult.data == true) {
            var decodedToken = await axios.post(config.AuthAddress + `/api/auth/decodeToken`, { token: token });
            console.log(decodedToken.data);
            req.userId = decodedToken.data.userId;
            next();
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};





router.post('/sendMessage', checkAuth, async (req, res) => {
    try {

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
        console.error('error in send message ' + error.message);
        res.status(500).send({ error: 'send message Internal Server Error' });
    }
});
router.post('/sendMessageToRoom', checkAuth, async (req, res) => {
    try {
        console.clear();
        const roomId = req.body.roomId;
        const powerstatus = req.body.powerStatus;
        const newMessage = req.body;
        const response = await axios.get(config.DeviceServiceAddress + '/api/room/getDevicesInRoomByRoomId/' + roomId);
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
        console.error('error in send message ' + error.message);
        res.status(500).send({ error: 'send message Internal Server Error' + error.message });
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


router.get('/getMyDeviceList', checkAuth, async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId);
        let [deviceList, roomList] = await Promise.all([
            getMyDeviceListFromService(userId),
            sendGetMyRoomListToservice(userId),
        ]);

        if (!deviceList || deviceList.length === 0) {
            deviceList = {};
        }
        if (!roomList || roomList.length === 0) {
            roomList = {};
        }

        const deviceListWithStatus = await Promise.all(deviceList.map(async (device) => {
            return {
                ...device,
                status: await getDeviceStatus(device.MacAddress) || 'off'
            };
        }));

        deviceList = deviceListWithStatus;

        res.json({ deviceList, roomList }); // Move this line to after previous processing

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


router.get('/getDeviceByMac/:mac', checkAuth, async (req, res) => {
    try {
        const result = await axios.get(config.DeviceServiceAddress + '/api/ctrl/getDeviceByMac/' + req.params.mac);
        res.send(result.data);
    } catch (error) {
        res.status(error.response.status).send(error.response.data);
    }
});

router.get('/isDeviceCreated/:mac', checkAuth, async (req, res) => {
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


router.post('/CreateDevice', async (req, res) => {
    try {
        const { userId, deviceName, deviceModel, Topic, MacAddress, powerStatus, deviceCustomization } = req.body;
        var response = await axios.post(config.DeviceServiceAddress + '/api/ctrl/createDevice', { userId, deviceName, deviceModel, Topic, MacAddress, powerStatus, deviceCustomization });

        if (response.data) {
            return res.status(200).send(response.data);
        } else {
            return res.status(500).send('Error creating device');
        }
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
});


router.get('/checkDeviceByMac/:mac', checkAuth, async (req, res) => {
    try {
        var response = await axios.post(config.DeviceServiceAddress + '/api/ctrl/checkDeviceByMac/' + req.params.mac);
        return res.status(200).send(response.data);
    } catch (error) {
        return res.status(500).send('Internal server error' + error.message);
    }
});


router.post('/updateDeviceName', checkAuth, async (req, res) => {
    try {
        const { deviceId, newDeviceName } = req.body;

        const response = await axios.post(config.DeviceServiceAddress + '/api/ctrl/updateDeviceName/', { userId: req.userId, deviceId, newDeviceName });

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


router.get('/DeleteDevice/:mac', checkAuth, (req, res) => {
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

router.get('/GetDevicesInRoom/:roomName', checkAuth, async (req, res) => {
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
router.get('/GetMyRoomList/', checkAuth, async (req, res) => {
    const userId = req.userId;
    var response = await sendGetMyRoomListToservice(userId);
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

router.post('/CreateRoom', checkAuth, (req, res) => {
    try {
        const { roomName } = req.body;
        const { userId } = req;
        console.log(roomName);
        axios.post(config.DeviceServiceAddress + '/api/room/create', { userId, roomName })
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
router.get('/DeleteRoom/:roomId', checkAuth, async (req, res) => {
    const response = await axios.get(config.DeviceServiceAddress + '/api/room/delete/' + req.params.roomId);

    res.status(200).send(response.data);
});

router.post('/updateRoomName', checkAuth, async (req, res) => {
    const { roomName, roomId } = req.body;

    if (!roomName || !roomId) {
        return res.status(400).send('Room name and room ID are required');
    }

    try {
        const { userId } = req;
        const response = await axios.post(config.DeviceServiceAddress + '/api/room/updateName/', {
            userId,
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

router.get('/getDevicesInRoomByRoomName/:roomName',checkAuth, async (req, res) => {
    var response = await axios.get(config.DeviceServiceAddress + '/api/ctrl/getDevicesInRoomByRoomName/' + req.params.roomName);
    res.status(200).json(response.data);
});
router.get('/getDevicesInRoomByRoomId/:roomId',checkAuth, async (req, res) => {
    const{userId} = req;
    var response = await axios.get(config.DeviceServiceAddress + '/api/room/getDevicesInRoomByRoomId/' + req.params.roomId+'/'+userId);
    res.status(200).json(response.data);
});
router.post('/AddDevicetoRoom', checkAuth, (req, res) => {
    try {
        const { roomId, deviceMac } = req.body;
        const { userId } = req;
        axios.get(config.DeviceServiceAddress + '/api/room/addDeviceToRoom/' + roomId + '/' + deviceMac + '/' + userId)
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


router.get('/removeDeviceFromRoom/:roomId/:deviceMac', checkAuth, (req, res) => {
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