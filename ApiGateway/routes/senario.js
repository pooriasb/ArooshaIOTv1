const express = require('express');
const router = express.Router();

router.get('/getMySenarioList/:userId', (req, res) => {
    res.sendStatus(200);
});

router.post('/createSenario', (req, res) => {
    res.sendStatus(200);
});
router.post('/startSenario', (req, res) => {
    res.sendStatus(200);
});
router.post('/updateSenario', (req, res) => {
    res.sendStatus(200);
});
router.post('/deleteSenario/:senarioId', (req, res) => {
    res.sendStatus(200);
});



module.exports = router;