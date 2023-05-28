const express = require('express');
const router = express.Router();


router.get('/sendMessage',(req,res)=>{
    res.sendStatus(200);
});
/***************************************************Device Management  */
router.get('/getMyDeviceList', (req, res) => {
    res.sendStatus(200);
});
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