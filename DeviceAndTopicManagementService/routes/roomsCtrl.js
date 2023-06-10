const express = require('express');
const router = express.Router();
router.use(express.json());
const rooms = require('../models/room');

router.get('/list/:userId', (req, res) => {
    rooms.getRooms(req.params.userId).then(value => { res.send(value) });
});

router.get('/getSingle/:roomId', (req, res) => {
    rooms.getRoomById(req.params.roomId).then(value => { res.send(value) });
});

router.post('/create', async (req, res) => {
    const { roomName } = req.body;
    try {
        const newRoom = await rooms.createRoom('Sajad', roomName);
        res.send(newRoom);
    } catch (error) {
        // Replace with appropriate error handling mechanism
        console.error(error);
        res.status(500).send('Failed to create room');
    }
});

router.post('/update/:id', async (req, res) => {
    const roomId = req.params.id;
    const updates = req.body;

    try {
        const updatedRoom = await rooms.updateRoomById(roomId, updates);
        res.send(updatedRoom);
    } catch (error) {
        // Replace with appropriate error handling mechanism
        console.error(error);
        res.status(500).send('Failed to update room by ID');
    }
});
router.get('/delete/:id', async (req, res) => {
    const roomId = req.params.id;
  
    try {
      await rooms.deleteRoomById(roomId);
      res.send('Room deleted successfully');
    } catch (error) {
      // Replace with appropriate error handling mechanism
      console.error(error);
      res.status(500).send('Failed to delete room by ID');
    }
  });
  router.get('/addDeviceToRoom/:roomName/:deviceMac', async (req, res) => {
    const roomName = req.params.roomName;
  
    try {
      await rooms.addDeviceToRoom('Sajad',roomName,req.params.deviceMac);
      res.send('added to room successfully');
    } catch (error) {
      // Replace with appropriate error handling mechanism
      console.error(error);
      res.status(500).send('Failed to delete room by ID');
    }
  });



module.exports = router;