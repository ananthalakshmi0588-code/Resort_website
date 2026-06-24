const express = require('express');
const router = express.Router();
const {
    createRoom,
    getRooms,
    getRoom,
    updateRoom,
    deleteRoom
} = require('../controllers/roomController');

router.post('/', createRoom);
router.get('/', getRooms);
router.get('/:id', getRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;