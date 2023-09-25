// subscriber.js
const mqtt = require('mqtt');
const TempHumidity = require('../models/tempHumiditymodel');
const { DHT, LED } = require('./topic');
const { client, connect } = require('./publisher');
const Device = require('../models/deviceModel')
// connect()

async function subscriber() {
  client.on('message', async (receivedTopic, message) => {
    if (receivedTopic === DHT) {
      // Chuyển đổi thông điệp từ dạng chuỗi thành một đối tượng dữ liệu
      const messageString = message.toString();
      const data = parseTemperatureAndHumidity(messageString);

      // Kiểm tra xem có dữ liệu hợp lệ
      if (data) {
        const { temperature, humidity, deviceId } = data;
        
        // Tìm phòng chứa thiết bị có deviceId tương ứng
        try {
          const device = await Device.findOne({ 'devices.id': deviceId });
          if (device) {
            console.log(`Temperature: ${temperature}, Humidity: ${humidity}, device: ${device.name}`);
            
            // Lưu dữ liệu vào MongoDB
            const tempHumidityData = new TempHumidity({
              temperature,
              humidity,
              deviceId: device.id,
              timestamp: new Date()
            });
            tempHumidityData.save()
              .then(() => {
                console.log('Dữ liệu đã được lưu vào MongoDB');
              })
              .catch((error) => {
                console.error('Lỗi khi lưu dữ liệu vào MongoDB:', error);
              });
          } else {
            console.error(`Không tìm thấy phòng cho thiết bị có deviceId: ${deviceId}`);
          }
        } catch (error) {
          console.error('Lỗi khi tìm kiếm phòng trong MongoDB:', error);
        }
      } else {
        console.error('Dữ liệu không hợp lệ:', messageString);
      }
    }
  });
}


function parseTemperatureAndHumidity(messageString) {
    const temperatureRegex = /Temperature: (\d+\.\d+)°C/i;
    const humidityRegex = /Humidity: (\d+)%/i;

    const temperatureMatch = messageString.match(temperatureRegex);
    const humidityMatch = messageString.match(humidityRegex);

    if (temperatureMatch && humidityMatch) {
        const temperature = parseFloat(temperatureMatch[1]);
        const humidity = parseInt(humidityMatch[1]);
        return { temperature, humidity };
    }

    return null; // Trả về null nếu không thể trích xuất dữ liệu
}

module.exports = { subscriber };
