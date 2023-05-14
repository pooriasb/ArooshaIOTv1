const express = require('express');
const cron = require('node-cron');
const router = express.Router();
const _ = require('lodash');
const mongoose = require('mongoose');
const helper = require('../models/schedulerHelper');

const event = new EventEmitter();

/************************Config database */
mongoose.connect('mongodb://127.0.0.1:27017/ArooshaIOT',)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));

const eventListSchema = new mongoose.Schema({
    deviceId: String,
    eventId: String
});
const EventList = mongoose.model('EventList', eventListSchema);
const ScheduleDocument = mongoose.model('ScheduleDocument', new mongoose.Schema({
    userId: String,
    scheduleCreateDateTime: Date,
    eventList: [eventListSchema],
    isScheduled: Boolean,
    scheduleTime: String
}));

// create test device

const DeviceDocument = mongoose.model('DeviceDocument', new mongoose.Schema({
    userId: String,
    deviceName: String,
    deviceModel: String,
    Topic: String,
    MacAddress : String
}));
const testDevice = new DeviceDocument({
    userId: 'sajad',
    deviceName: 'loostere Icerock',
    deviceModel: 'ICEROCK0585',
    Topic: 'ArooshaIOT/sajad/h1/r1',
    MacAddress :'0253'
});
//testDevice.save();
/********************************************************** */


/***********************************Create Scheduler */
router.get('/CreateScheduler', (req, res) => {
    CreateScheduler();
    res.sendStatus(200);
});
//scheduletime : m,h,d
async function CreateScheduler() {


    // weekDays :[1,2,3],
    // hour : 5,
    // minute :10,
    // isOnce:false
    var times = {
        isOnce: false,
        weekDays: [1, 2, 3],
        hour: 5,
        minute: 10
    }


    const newSchedule = new ScheduleDocument({
        userId: 'sajad',
        scheduleDateTime: Date.now(),
        eventList: [new EventList({ deviceId: '3223', eventId: '008' }), new EventList({ deviceId: '123', eventId: '009' })],
        isScheduled: true,
        scheduleTime: JSON.stringify(times)
    });
    const result = await newSchedule.save();
    console.log(result);
}

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




cron.schedule('*/5 * * * * *', async () => {

    const schedules = await ScheduleDocument.find({ isScheduled: true });

    schedules.forEach(element => {
        var scheTime = JSON.parse(element.scheduleTime);
        //Scheduler run once
        if (scheTime.isOnce) {
            var now = new Date();
            if (now.getHours === scheTime.hour && now.getMinutes === scheTime.minute || true) {
                //it is now and we have to run a task



            }
        } 
        /// scheduler is repeater
        else {
            console.log('its Repeater');
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