var express = require('express');
var router = express.Router();

const deviceController = require('../controllers/deviceController');

router.get('/', deviceController.getDevices);

router.post('/create', deviceController.createDevice);
router.put('/led', deviceController.updateLedStatus);
router.put('/pan', deviceController.updatePanStatus);
router.put('/manually', deviceController.updateManuallyStatus);
module.exports = router;