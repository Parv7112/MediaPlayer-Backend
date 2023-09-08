const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/RoomController')

router.post('/createRoom', RoomController.createRoom);
router.post('/joinRoom', RoomController.joinRoom);
router.get('/getRoom/:roomId', RoomController.getRoom);

module.exports = router;
