const express = require('express');
const router = express.Router();
const config = require('config');

const axios = require('axios');
router.use(express.json());
router.post('/sendMessage', async (req, res) => {
    try {
        const message = req.body;
        console.log(message);
        const response = await axios.post(`${config.SocketAddress}/sendMessage`, { message });
        res.sendStatus(200);
    } catch (error) {
        //   console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


router.get('/getLastMessage/:mac', (req, res) => {
    var response = axios.post(config.LogAddress + '/api/log//getLastMessage/' + req.params.mac);

    res.send(response.data);
});
/***************************************************Device Management  */

router.get('/getMyDeviceList/:userId', async (req, res) => {
    try {
        const [deviceList, roomList] = await Promise.all([
            getMyDeviceListFromService(req.params.userId),
            sendGetMyRoomListToservice(req.params.userId)
        ]);
        res.json({ deviceList });
    } catch (error) {
        console.log('Error:  ' + error);
        res.status(500).json({ error: error.message });
    }
});

async function getMyDeviceListFromService(userId) {
    try {
        const response = await axios.get(`${config.DeviceServiceAddress}/api/ctrl/list/${userId}`);
        return response.data;
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return 'error';
    }
}


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
        let roomName = req.body.roomName;
        let roomId = req.body.roomId;

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

router.get('/DeviceListInRoom', (req, res) => {
    res.sendStatus(200);
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