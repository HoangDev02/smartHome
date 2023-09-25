const Event = require('../models/eventModel'); 

// Lấy tất cả các sự kiện
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events); 
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

// Lấy sự kiện theo ID
exports.getEventById = async (req, res) => {  
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({message: 'Event not found'});
    res.json(event);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

// Tạo mới sự kiện 
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
}

// Cập nhật sự kiện
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!event) return res.status(404).json({message: 'Event not found'});
    res.json(event);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
}

// Xóa sự kiện
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({message: 'Event not found'});
    res.json({message: 'Event deleted successfully'});
  } catch (err) { 
    res.status(500).json({message: err.message});
  }
}

exports.filterEvents = async (req, res) => {
    const filter = {};
    if(req.query.deviceId) filter.deviceId = req.query.deviceId; 
    if(req.query.eventType) filter.eventType = req.query.eventType;
  
    try {
      const events = await Event.find(filter);
      res.json(events);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  }
  exports.getEventsByTime = async (req, res) => {
    const { startTime, endTime } = req.query;
  
    try {
      const events = await Event.find({
        timestamp: {
          $gte: new Date(startTime),
          $lte: new Date(endTime)
        }
      });
  
      res.json(events);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  }