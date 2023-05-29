const express = require('express');
const router = express.Router();
const config = require('config');
const http = require('http');
const axios = require('axios');
router.get('/sendMessage', (req, res) => {
    res.sendStatus(200);
});
/***************************************************Device Management  */
//TODO: it needs to select specific filds to return in the device micro service
router.get('/getMyDeviceList/:userId', (req, res) => {
    //http://127.0.0.1:3003/api/ctrl/list/sajad
    getMyDeviceListFromService(req.params.userId).then((value) => {
        res.send(value);
    });

});
function getMyDeviceListFromService(userId) {
    return p = new Promise((resolve, reject) => {

        http.get(config.DeviceServiceAddress + '/api/ctrl/list/' + userId, (resp) => {
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

router.get('/DeleteDevice/:deviceId', (req, res) => {
    sendDeleteRequestToService(req.params.deviceId);
    res.send( sendDeleteRequestToService(req.params.deviceId));
});
function sendDeleteRequestToService(deviceId){
    axios.get(config.DeviceServiceAddress + '/api/ctrl/delete/'+deviceId)
    .then(response => {
    return  response.data;
    })
    .catch(error => {
     return "-1";
    });
}
/************************************************************ */
/*********************************Room Management */
router.get('/GetMyRoomList/:userId', (req, res) => {
    res.send(sendGetMyRoomListToserver(req.params.userId));
});

function sendGetMyRoomListToserver(userId){
    axios.get(config.DeviceServiceAddress + '/api/ctrl/RoomList/'+userId)
    .then(response => {
    return  response.data;
    })
    .catch(error => {
     return "-1";
    });
}
router.get('/CreateRoom', (req, res) => {
    res.sendStatus(200);
});
router.get('/DeleteRoom', (req, res) => {
    res.sendStatus(200);
});

router.get('/DeviceListInRoom', (req, res) => {
    res.sendStatus(200);
});
router.post('/AddDevicetoRoom', (req, res) => {
    res.sendStatus(200);
});
/************************************************** */


module.exports = router;