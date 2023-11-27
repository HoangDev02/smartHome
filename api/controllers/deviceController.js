const Device = require('../models/deviceModel');
const {publishManuallyStatus, publishLCDStatus} = require('../cli/publisher')
const {MANUALLY} = require('../cli/topic')
exports.getDevices = async(req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices); 
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Server Error'});
  }
}
exports.getDevice = async(req, res) => {
  try {
    const devices = await Device.findById(req.params.id);
    res.status(200).json(devices); 
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

// exports.updateLedStatus = async (req, res) => {
//   const { id, status } = req.body;
//   const device = await Device.findByIdAndUpdate(id, {status}, {new: true});

//   // Publish lên MQTT
//   publishLedStatus(device.id, status); 
  
//   res.json(device);
// }

// exports.updatePanStatus = async(req,res) => {
//   const {id, status} = req.body;
//   const device = await Device.findByIdAndUpdate(id, {status}, {new: true});

//   publishPanStatus(device.id, status)
//   res.json(device);

// }

exports.updateManuallyStatus = async(req,res) => {
  const id = req.params.id
  const {name,status} = req.body;
  const device = await Device.findByIdAndUpdate(id, {status}, {new: true});

  publishManuallyStatus(name,device.id, status)
  res.status(200).json(device);
}

exports.updateLCDStatus = async(req,res) => {
  const id = req.params.id
  const {name,type} = req.body;
  const device = await Device.findByIdAndUpdate(id, {type}, {new: true});
  publishLCDStatus(name,device.id, type)
  res.status(200).json(device);
}