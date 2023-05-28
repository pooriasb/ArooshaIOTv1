const express = require('express');
const router = express.Router();
const config = require('config');
const http = require('http');

router.get('/sendMessage',(req,res)=>{
    res.sendStatus(200);
});
/***************************************************Device Management  */
// it needs to select specific filds to return in the device micro service
router.get('/getMyDeviceList/:userId', (req, res) => {
    //http://127.0.0.1:3003/api/ctrl/list/sajad
    getMyDeviceListFromService(req.params.userId).then((value)=>{
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





router.get('/CreateDevice', (req, res) => {
    res.sendStatus(200);
});
router.get('/DeleteDevice', (req, res) => {
    res.sendStatus(200);
});
/************************************************************ */
/*********************************Room Management */
router.get('/GetMyRoomList', (req, res) => {
    res.sendStatus(200);
});
router.get('/CreateRoom', (req, res) => {
    res.sendStatus(200);
});
router.get('/DeleteRoom', (req, res) => {
    res.sendStatus(200);
});
/************************************************** */


module.exports = router;