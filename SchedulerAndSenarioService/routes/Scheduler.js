const express = require('express');
const cron = require('node-cron');
const router = express.Router();
const mongoose = require('mongoose');

/*************************Testing Node-Corn*************************** */

// cron.schedule('*/1 * * * * *', () => {
//     console.log('running a task every minute');
//   },{scheduled:true});
mongoose.connect('mongodb://127.0.0.1:27017/ArooshaIOT')
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));

    const eventListSchema = new mongoose.Schema({
        deviceId: String,
        eventId: String
    });
    const EventList = mongoose.model('EventList',eventListSchema);
const ScheduleDocument = mongoose.model('ScheduleDocument', new mongoose.Schema({
    scheduleDateTime: Date,
    eventList: [eventListSchema],
    isScheduled: Boolean
}));

router.get('/CreateScheduler', (req, res) => {
    CreateScheduler();
    res.sendStatus(200);
});

async function CreateScheduler() {
    const newSchedule = new ScheduleDocument({
        scheduleDateTime: Date.now(),
        eventList: [new EventList({deviceId:'3223',eventId:'008'}),new EventList({deviceId:'123',eventId:'009'})],
        isScheduled: true
    });
    const result = await newSchedule.save();
    console.log(result);
}

module.exports = router;