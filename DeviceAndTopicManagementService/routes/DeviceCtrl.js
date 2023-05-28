const express = require('express');
const router = express.Router();
const device = require('../models/device');
router.get('/list/:userId',(req,res)=>{
device.getUserDeviceList(req.params.userId).then(value => {res.send(value)});
});





module.exports = router;