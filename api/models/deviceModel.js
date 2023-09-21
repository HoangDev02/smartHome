const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Loại thiết bị (đèn, màn hình LCD, nhiệt độ, độ ẩm, cảm biến lửa, quạt, cảm biến người qua lại, v.v.)
  status: { type: Boolean, default: false }, // Trạng thái hiện tại (bật/tắt)
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }, // Phòng mà thiết bị đặt trong
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
