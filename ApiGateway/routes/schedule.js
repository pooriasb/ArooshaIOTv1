const express = require('express');
const router = express.Router();
const config = require('config');
const axios = require('axios');
//127.0.0.1:3002/api/scheduler
//mySchedules
//setActivation
router.get('/getMyScheduleList/:userId', async (req, res) => {
    var response = await axios.get(config.SchedulerAddress + '/api/scheduler/mySchedules/' + req.params.userId);
    res.json(response.data);
});
router.post('/createSchedule', async (req, res) => {
    const { isOnce, weekDays, hour, minute, events } = req.body;
    var response = await axios.post(config.SchedulerAddress + '/api/scheduler/CreateScheduler', {
        isOnce, weekDays, hour, minute, events
    });
    res.send(response.data);
});
router.post('/setScheduleStatus', async (req, res) => {
    const { status, token, scheduleId } = req.body;
    var response = await axios.post(config.SchedulerAddress + '/api/scheduler/setActivation', {
        scheduleId,
        isScheduled: status
    });
    res.send(response.data);
});
router.post('/updateShedule', async (req, res) => {
    const { isOnce, weekDays, hour, minute, events, scheduleId } = req.body;
    var response = await axios.post(config.SchedulerAddress + '/api/scheduler/CreateScheduler', {
        isOnce, weekDays, hour, minute, events, scheduleId
    });
    res.send(response.data);
});
router.post('/deleteSchedule/:scheduleId', async (req, res) => {
    var response = await axios.get(config.SchedulerAddress + '/api/scheduler/deleteSchedule/' + req.params.scheduleId);
    res.send(response.data);
});
module.exports = router;