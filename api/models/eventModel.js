const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' }, // Thiết bị liên quan đến sự kiện
  eventType: { type: String, required: true }, // Loại sự kiện (bật/tắt)
  timestamp: { type: Date, default: Date.now }, // Thời gian xảy ra sự kiện
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
