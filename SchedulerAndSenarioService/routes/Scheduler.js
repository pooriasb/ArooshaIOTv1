const express = require('express');
const cron = require('node-cron');
const router = express.Router();
const _ = require('lodash');
const mongoose = require('mongoose');


/************************Config database */
mongoose.connect('mongodb://127.0.0.1:27017/ArooshaIOT')
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
    scheduleTimes: [{ type: String }]
}));
/********************************************************** */


/***********************************Create Scheduler */
router.get('/CreateScheduler', (req, res) => {
    CreateScheduler();
    res.sendStatus(200);
});
//scheduletime : m,h,d
async function CreateScheduler() {
    const newSchedule = new ScheduleDocument({
        userId: 'sajad',
        scheduleDateTime: Date.now(),
        eventList: [new EventList({ deviceId: '3223', eventId: '008' }), new EventList({ deviceId: '123', eventId: '009' })],
        isScheduled: true,
        scheduleTimes: ['1 * *']
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

    const schedules = await ScheduleDocument.find({ userId: userId });
    schedules.forEach(element => {
        // console.log(element);

        if (element.isScheduled) {
            /////// console.log(element.scheduleTimes);

            element.scheduleTimes.forEach(schetime => {

                var schetimeToSet = schetime + ' * * *';
                cron.schedule(schetimeToSet, () => {
                    console.log('this is scheduler');
                    console.log(_.map(element.eventList,o=> _.pick(o,'deviceId','eventId')));
                }, { scheduled: element.isScheduled });
            });
        }
    });
}
/******************************************************* */

module.exports = router;