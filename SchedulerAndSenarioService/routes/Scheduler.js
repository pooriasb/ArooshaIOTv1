const express = require('express');
const cron = require('node-cron');
const router = express.Router();
const _ = require('lodash');
const mongoose = require('mongoose');
const helper = require('../models/schedulerHelper');
const scheduleModel = require('../models/scheduleModel');


/***********************************Create Scheduler */
router.get('/CreateScheduler', (req, res) => {
    scheduleModel.scheduleModel.CreateScheduler();
    res.sendStatus(200);
});


/******************************End create scheduler */



/**********************************Start Schedule and Connect to mqtt Service */

router.get('/StartScheule', (req, res) => {
    StartScheule('sajad')
    res.sendStatus(200);
});

cron.schedule('*/10 * * * * *', async () => {

    const schedules = await scheduleModel.scheduleModel.find({ isScheduled: true }); 
    schedules.forEach( element => {
        var scheTime = JSON.parse(element.scheduleTime);
        //Scheduler run once
        if (scheTime.isOnce) {
            var now = new Date();
            if (now.getHours === scheTime.hour && now.getMinutes === scheTime.minute) {
                //it is now and we have to run a task
             helper.createMqttMessageRequest(element._id);
            }
        }
        /// scheduler is repeater
        else {
            //console.log('its Repeater');
            var now = new Date();
        console.log(scheTime.weekDays.includes(now.getDay()) + ' ' + now.getDay());
        if (now.getHours === scheTime.hour && now.getMinutes === scheTime.minute && scheTime.weekDays.includes(now.getDay()) || true) {
            //it is now and we have to run a task
         helper.createMqttMessageRequest(element._id);
        }
        }
    })
}, { scheduled: true });

module.exports = router;

// let rule = new cron.RecurrenceRule();
// rule.hour = 02;
// rule.minute = 57;
// rule.seconds = 00;

// let backUpMeteorLogs = cron.scheduleJob(rule, function(){
//   console.log("The cron task is complete");
// });