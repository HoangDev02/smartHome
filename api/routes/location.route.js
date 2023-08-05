var express = require('express')
var router = express.Router()
var locationController = require('../controllers/location.controllers')

router.get('/', locationController.getLocations)

router.post('/create', locationController.createLocation)
router.delete('/delete', locationController.deleteLocation)

module.exports = router