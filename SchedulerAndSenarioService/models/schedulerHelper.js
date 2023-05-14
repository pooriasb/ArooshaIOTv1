
const _ = require('lodash');
const mongoose = require('mongoose');

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
        scheduleTime: String
    }));




function createMqttMessageRequest(scheduleId ){


}


module.exports.createMqttMessageRequest = createMqttMessageRequest;