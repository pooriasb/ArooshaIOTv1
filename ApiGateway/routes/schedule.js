const express = require('express');
const router = express.Router();
const config = require('config');
const axios = require('axios');
//127.0.0.1:3002/api/scheduler
//mySchedules
//setActivation
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

router.get('/getSchedule/:scheduleId',checkAuth, async (req, res) => {

    var response = await axios.get(config.SchedulerAddress + '/api/scheduler/getSchedule/' + req.params.scheduleId);
    res.send(response.data);
});
router.get('/getMyScheduleList/',checkAuth, async (req, res) => {
    var response = await axios.get(config.SchedulerAddress + '/api/scheduler/mySchedules/' + req.userId);
    res.json(response.data);
});
router.post('/createSchedule',checkAuth, async (req, res) => {
    const { isOnce, weekDays, hour, minute, events } = req.body;
    const {userId} = req;
    if (!isOnce || !weekDays || !hour || !minute || !events) {
        return res.status(400).send("Error: Please set all parameters.");
    }

    console.log(req.body);
    var response = await axios.post(config.SchedulerAddress + '/api/scheduler/CreateScheduler', {
        userId,   isOnce, weekDays, hour, minute, events
    });
    return res.send(response.data);
});

router.post('/setScheduleStatus', checkAuth, async (req, res) => {
    try {
        const { status, scheduleId } = req.body;
     
        var response = await axios.post(config.SchedulerAddress + '/api/scheduler/setActivation', {
            scheduleId,
            isScheduled: status
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/updateShedule',checkAuth, async (req, res) => {
    const { isOnce, weekDays, hour, minute, events, scheduleId } = req.body;
    var response = await axios.post(config.SchedulerAddress + '/api/scheduler/updateSchedule', {
        isOnce, weekDays, hour, minute, events, scheduleId
    });
    res.send(response.data);
});
router.post('/deleteSchedule/:scheduleId', async (req, res) => {
  try {
    var response = await axios.get(config.SchedulerAddress + '/api/scheduler/deleteSchedule/' + req.params.scheduleId);
    return res.status(200).send('deleted');
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;