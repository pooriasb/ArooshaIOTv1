const express = require('express');
const router = express.Router();
router.use(express.json());
const axios = require('axios');
const config = require('config');
const {
  getAllLimits,
  getLimitById,
  createLimit,
  updateLimitById,
  deleteLimitById,
  setLimitActive,
  LimitCheck
} = require('../models/limit');

router.get('/', (req, res) => { res.send('hi get') });
router.post('/', (req, res) => { res.send('hi post') });




router.get('/Check/:id', async (req, res) => {
  var result = await LimitCheck(req.params.id);
  res.send(result);
});


router.post('/create', async (req, res) => {
  const { userId, deviceMac, deviceName, maxUsePower, dimmer } = req.body;
  try {
    const result = await createLimit({ userId, deviceMac, deviceName, maxUsePower, dimmer });
    res.status(201).json({ success: true, message: 'Limit entry created successfully', data: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Endpoint to retrieve all limit entries
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const limits = await getAllLimits(userId);
    res.send(limits);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Endpoint to retrieve a specific limit entry by ID
router.get('/single/:id', async (req, res) => {
  try {
    const limit = await getLimitById(req.params.id);
    res.send(limit);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Endpoint to update a specific limit entry by ID
router.post('update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedLimit = await updateLimitById(id, req.body);
    res.send(updatedLimit);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Endpoint to delete a specific limit entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLimit = await deleteLimitById(id);
    res.send(deletedLimit);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Endpoint to set a specific limit entry as active or inactive by ID
router.post('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const isActive = req.body.isActive;
    const updatedLimit = await setLimitActive(id, isActive);
    res.send(updatedLimit);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;