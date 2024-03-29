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
    mac : String,
    isStarted :  { type: Boolean, default: false },
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
router.get('/list/:userId', async (req, res) => {
    try {
        const powerSupplies = await PowerSupply.find({userId:req.params.userId});
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

// Create the powerSupply route
router.post('/powerSupply', async (req, res) => {
    try {

      const {userId,id, powerType, senarioId, maxPower, mac, isStarted } = req.body;
      
      // Check if a record with the given userId already exists
      const existingRecord = await PowerSupply.findOne({ _id:id });
      
      if (existingRecord) {
        // Update the existing record
        existingRecord.powerType = powerType;
        existingRecord.senarioId = senarioId;
        existingRecord.maxPower = maxPower;
        existingRecord.mac = mac;
        existingRecord.isStarted = isStarted;
        
        await existingRecord.save();
        
        res.json({ message: 'Record updated successfully' });
      } else {
        // Insert a new record
        const newRecord = new PowerSupply({ userId, powerType, senarioId, maxPower, mac, isStarted });
        
        await newRecord.save();
        
        res.json({ message: 'Record inserted successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


module.exports = router;
