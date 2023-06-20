const express = require('express');
const router = express.Router();
router.use(express.json());
const rooms = require('../models/room');
const device = require('../models/device');
router.get('/list/:userId', (req, res) => {

    rooms.getRooms(req.params.userId).then(value => {

        res.send(value)
    });
});

router.get('/getSingle/:roomId', (req, res) => {
    rooms.getRoomById(req.params.roomId).then(value => { res.send(value) });
});

router.post('/create', async (req, res) => {
    const { roomName } = req.body;
    try {
        const newRoom = await rooms.createRoom('sajad', roomName);
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

router.post('/updateName/', async (req, res) => {

    const { roomName, roomId } = req.body;

    try {
        const oldRoom = await rooms.getRoomById(roomId)
        if (oldRoom) {
            const updateDeviceRoomNameResult = device.updateDeviceRoom(oldRoom.roomName, 'sajad', roomName);
            if (updateDeviceRoomNameResult == 200) {
                const updatedRoom = await rooms.updateRoomName(roomId, roomName);
            } else if (updateDeviceRoomNameResult == 500) return res.status(500).send('Error on rename device room name')
            return res.send(updatedRoom);
        }
        return res.status(404).send('room not found')
    } catch (error) {
        // Replace with appropriate error handling mechanism
        console.error(error);
        res.status(500).send('Failed to update room ');
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
router.get('/addDeviceToRoom/:roomId/:deviceMac', async (req, res) => {
    const roomId = req.params.roomId;
    console.log(roomId);
    console.log(req.params.deviceMac);
    try {
        var result = await rooms.addDeviceToRoom(roomId, req.params.deviceMac);
        res.send(result);
    } catch (error) {
        // Replace with appropriate error handling mechanism
        console.error(error);
        res.status(500).send('Failed to delete room by ID');
    }
});
router.get('/removeDeviceFromRoom/:roomId/:deviceMac', async (req, res) => {
    const roomId = req.params.roomId;
    try {
        var result = await rooms.removeDeviceFromRoom(roomId, req.params.deviceMac);
        res.send(result);
    } catch (error) {
        // Replace with appropriate error handling mechanism
        console.error(error);
        res.status(500).send('Failed to delete device from room by ID');
    }
});



module.exports = router;