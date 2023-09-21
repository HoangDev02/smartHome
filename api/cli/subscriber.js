// subscriber.js
const mqtt = require('mqtt');
const TempHumidity = require('../models/tempHumiditymodel');
const { DHT, options } = require('./topic');
const { client, connect } = require('./publisher');

// connect()

function subscriber() {
    client.on('message', (receivedTopic, message) => {
        if (receivedTopic === DHT) { // Kiểm tra topic nhận được
          // Chuyển đổi thông điệp từ dạng chuỗi thành một đối tượng dữ liệu
          const messageString = message.toString();
          const data = parseTemperatureAndHumidity(messageString);
    
          // Kiểm tra xem có dữ liệu hợp lệ
          if (data) {
            const { temperature, humidity } = data;
            console.log(`Temperature: ${temperature}, Humidity: ${humidity}`);
    
            // Lưu dữ liệu vào MongoDB
            const tempHumidityData = new TempHumidity({
              temperature,
              humidity,
              timestamp: new Date(),
            });
    
            tempHumidityData.save()
              .then(() => {
                console.log('Dữ liệu đã được lưu vào MongoDB');
              })
              .catch((error) => {
                console.error('Lỗi khi lưu dữ liệu vào MongoDB:', error);
              });
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
