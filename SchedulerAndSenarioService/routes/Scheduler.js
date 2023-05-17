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

async function StartScheule(userId) {






    /*************************Testing Node-Corn*************************** */

    // cron.schedule('*/1 * * * * *', () => {
    //     console.log('running a task every minute');
    //   },{scheduled:true});

    // const schedules = await ScheduleDocument.find({ userId: userId });

    // schedules.forEach(element => {

    //     element.scheduleTimes.forEach(schetime => {
    //         var schetimeToSet = schetime + ' * * *';
    //         const url_taskMap = {};
    //         var job = cron.schedule(schetimeToSet, () => {

    //             doSchedulerJob(element._id);


    //             //  var ungroupedData = [];

    //             // var EventsWithDeviceAndEvent = _.map(element.eventList, o => _.pick(o, 'deviceId', 'eventId'));
    //             //  console.log(element.eventList);

    //             // EventsWithDeviceAndEvent.forEach(async deviceAndEvent => {
    //             //     var selectedDeviceId = deviceAndEvent.deviceId;

    //             //     var selectedTopic = await DeviceDocument.findById(selectedDeviceId).select({ Topic: 1, _id: 0 });
    //             //     var topicParsed = selectedTopic['Topic'];
    //             //     ungroupedData.push({ topicParsed, DeviceID: selectedDeviceId, EventID: deviceAndEvent.eventId });

    //             // });

    //         }, { scheduled: true });

    //     });
    // });

}
/******************************************************* */




cron.schedule('*/10 * * * * *', async () => {

    const schedules = await scheduleModel.scheduleModel.find({ isScheduled: true });
    schedules.forEach( element => {
        var scheTime = JSON.parse(element.scheduleTime);
        //Scheduler run once
        if (scheTime.isOnce) {
            var now = new Date();
            if (now.getHours === scheTime.hour && now.getMinutes === scheTime.minute || true) {
                //it is now and we have to run a task
             helper.createMqttMessageRequest(element._id);

            }
        }
        /// scheduler is repeater
        else {
            //console.log('its Repeater');
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