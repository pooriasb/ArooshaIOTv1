const express = require('express');
const router = express.Router();

router.get('/getMyScheduleList/:userId', (req, res) => {
    res.sendStatus(200);
});
router.post('/createSchedule', (req, res) => {
    res.sendStatus(200);
});
router.post('/setScheduleStatus', (req, res) => {
    res.sendStatus(200);
});
router.post('/updateShedule', (req, res) => {
    res.sendStatus(200);
});
router.post('/deleteSchedule/:scheduleId', (req, res) => {
    res.sendStatus(200);
});
module.exports = router;