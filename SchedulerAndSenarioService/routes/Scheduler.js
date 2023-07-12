const express = require('express');
const cron = require('node-cron');
const router = express.Router();
const _ = require('lodash');
const helper = require('../models/schedulerHelper');
const scheduleModel = require('../models/scheduleModel');
const { Schema } = require('mongoose');

router.use(express.json());
/***********************************Create Scheduler */
router.post('/CreateScheduler', async (req, res) => {
    const {userId ,isOnce, weekDays, hour, minute, events } = req.body;
    var data = {
        userId, isOnce, weekDays, hour, minute, events
    }
    var result = await scheduleModel.createScheduler(data);
    res.send(result);
});

router.get('/mySchedules/:userId', async (req, res) => {
    const schedules = await scheduleModel.readSchedules(req.params.userId);
    res.send(schedules);
});

router.get('/deleteSchedule/:scheduleId', async (req, res) => {
    try {
        const value = await scheduleModel.deleteSchedule(req.params.scheduleId);
        return res.status(200).send('deleted');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

router.post('/updateSchedule', async (req, res) => {
    const { isOnce, weekDays, hour, minute, events, scheduleId } = req.body;
    var result = await scheduleModel.updateScheduleDocument(scheduleId, { isOnce, weekDays, hour, minute, events });
    res.send(result);
});
/******************************End create scheduler *****************/
router.post('/setActivation', async (req, res) => {
    try {
        const { scheduleId, isScheduled } = req.body; // we have to get token and some validation here
        var result = await scheduleModel.setScheduleActivation(scheduleId, isScheduled);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});


router.get('/getSchedule/:scheduleId', async (req, res) => {
    var result = await scheduleModel.getScheduleById(req.params.scheduleId);
    if (result) return res.status(200).send(result);
    return res.status(404).send('not found')

});
/**********************************Start Schedule and Connect to mqtt Service */



cron.schedule('*/10 * * * * *', async () => {

    const schedules = await scheduleModel.scheduleModel.find({ isScheduled: true });
    schedules.forEach(element => {
        var scheTime = JSON.parse(element.scheduleTime);
        //Scheduler run once
        if (scheTime.isOnce) {// it is not repeater
            var now = new Date();
            if (now.getHours === scheTime.hour && now.getMinutes === scheTime.minute) {
                helper.createMqttMessageRequest(element._id);
            }
        }
        else {
            var now = new Date();
            if (now.getHours === scheTime.hour && now.getMinutes === scheTime.minute && scheTime.weekDays.includes(now.getDay()) || true) {
                helper.createMqttMessageRequest(element._id);
            }
        }
    })
}, { scheduled: true });



module.exports = router;