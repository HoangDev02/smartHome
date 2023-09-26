const Device = require('../models/deviceModel');
const {publishLedStatus , publishPanStatus, publishManuallyStatus} = require('../cli/publisher')

exports.getDevices = async(req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices); 
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Server Error'});
  }
}


exports.createDevice = async (req, res) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (err) {
    console.error(err);
    res.status(400).json({message: 'Invalid device data'});
  }
}

exports.updateLedStatus = async (req, res) => {
  const { id, status } = req.body;
  const device = await Device.findByIdAndUpdate(id, {status}, {new: true});

  // Publish lên MQTT
  publishLedStatus(device.id, status); 
  
  res.json(device);
}

exports.updatePanStatus = async(req,res) => {
  const {id, status} = req.body;
  const device = await Device.findByIdAndUpdate(id, {status}, {new: true});

  publishPanStatus(device.id, status)
  res.json(device);

}

exports.updateManuallyStatus = async(req,res) => {
  const {id, status} = req.body;
  const device = await Device.findByIdAndUpdate(id, {status}, {new: true});

  publishManuallyStatus(device.id, status)
  res.json(device);

}