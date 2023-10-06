const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  img: { type: String }, 
  status: { type: Boolean, default: false }, // Trạng thái hiện tại (bật/tắt)
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }, // Phòng mà thiết bị đặt trong
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
