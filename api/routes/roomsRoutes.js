var express = require('express')
var router = express.Router()
var roomsController = require('../controllers/roomsController')

router.get('/', roomsController.getAllRooms)
router.get('/:id', roomsController.getRoom)
router.post('/create', roomsController.createRoom)
router.put('/update/:id', roomsController.updateRoom)
router.delete('/:id', roomsController.deleteRoom)

module.exports = router