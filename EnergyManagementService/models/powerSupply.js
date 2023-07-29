const express = require('express');
const router = express.Router();
router.use(express.json());

const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.dbAddress)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Error ' + err));

const powerSchema = new mongoose.Schema({
    userId: String,
    powerType: String,
    senarioId: String,
    maxPower: String,
    mac : String
});

const PowerSupply = mongoose.model('powerSupply', powerSchema);

// Create a new powerSupply
router.post('/', async (req, res) => {
    try {
        const {
            userId,
            powerType,
            senarioId,
            maxPower,
            mac
          } = req.body;
        const powerSupply = new PowerSupply({    userId,
            powerType,
            senarioId,
            maxPower,mac});
        await powerSupply.save();
        res.status(201).send(powerSupply);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a list of all powerSupplies
router.get('/', async (req, res) => {
    try {
        const powerSupplies = await PowerSupply.find({userId:req.body.userId});
        res.send(powerSupplies);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a single powerSupply by id
router.get('/:id', async (req, res) => {
    try {
        const powerSupply = await PowerSupply.findById(req.params.id);
        if (!powerSupply) {
            return res.status(404).send();
        }
        res.send(powerSupply);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a powerSupply by id
router.patch('/:id', async (req, res) => {
    try {
        const powerSupply = await PowerSupply.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!powerSupply) {
            return res.status(404).send();
        }
        res.send(powerSupply);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a powerSupply by id
router.delete('/:id', async (req, res) => {
    try {
        const powerSupply = await PowerSupply.findByIdAndDelete(req.params.id);
        if (!powerSupply) {
            return res.status(404).send();
        }
        res.send(powerSupply);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
