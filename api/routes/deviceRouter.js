var express = require('express');
var router = express.Router();

const deviceController = require('../controllers/deviceController');

router.get('/', deviceController.getDevices);

router.post('/create', deviceController.createDevice);
router.put('/led', deviceController.updateLedStatus);
module.exports = router;