const express = require('express');
const app = express();
var cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
const connectMongodb = require('./api/connect/connect');
const mqtt = require('mqtt');
const TempHumidity = require('./api/models/tempHumiditymodel');
const {connect} = require('./api/cli/publisher')
const {subscriber} = require('./api/cli/subscriber');

const locationRoute = require('./api/routes/location.route');
const roomsRoutes = require('./api/routes/roomsRoutes')
const deviceRouter = require('./api/routes/deviceRouter');

const port = 8080;
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// var options = {
//   host: 'f63a3874d1364c15ba9d13699c92dc63.s1.eu.hivemq.cloud',
//   port: 8883,
//   protocol: 'mqtts',
//   username: 'esp8266Den',
//   password: 'esp8266Den'
// }
// var client = mqtt.connect(options);

// client.on('error', function (error) {
//   console.log(error);
// });
// // Sự kiện khi kết nối thành công
// client.on('connect', connect);

// client.on('message', (receivedTopic, message) => {
//   if (receivedTopic === 'DHT') { // Kiểm tra topic nhận được
//     // Chuyển đổi thông điệp từ dạng chuỗi thành một đối tượng dữ liệu
//     const messageString = message.toString();
//     const data = parseTemperatureAndHumidity(messageString);

//     // Kiểm tra xem có dữ liệu hợp lệ
//     if (data) {
//       const { temperature, humidity } = data;
//       console.log(`Temperature: ${temperature}, Humidity: ${humidity}`);

//       // Lưu dữ liệu vào MongoDB
//       const tempHumidityData = new TempHumidity({
//         temperature,
//         humidity,
//         timestamp: new Date(),
//       });

//       tempHumidityData.save()
//         .then(() => {
//           console.log('Dữ liệu đã được lưu vào MongoDB');
//         })
//         .catch((error) => {
//           console.error('Lỗi khi lưu dữ liệu vào MongoDB:', error);
//         });
//     } else {
//       console.error('Dữ liệu không hợp lệ:', messageString);
//     }
//   }
// });

// // Hàm để phân tích dữ liệu nhiệt độ và độ ẩm từ chuỗi
// function parseTemperatureAndHumidity(messageString) {
//   const temperatureRegex = /Temperature: (\d+\.\d+)°C/i;
//   const humidityRegex = /Humidity: (\d+)%/i;

//   const temperatureMatch = messageString.match(temperatureRegex);
//   const humidityMatch = messageString.match(humidityRegex);

//   if (temperatureMatch && humidityMatch) {
//     const temperature = parseFloat(temperatureMatch[1]);
//     const humidity = parseInt(humidityMatch[1]);
//     return { temperature, humidity };
//   }

//   return null; // Trả về null nếu không thể trích xuất dữ liệu
// }

// // Xử lý sự kiện khi bị ngắt kết nối
// client.on('close', () => {
//   console.log('Kết nối đã đóng');
// });

app.use('/v1/api/location', locationRoute);
app.use('/api/room', roomsRoutes)
app.use('/api/devices', deviceRouter);
app.listen(port, () => {
  subscriber();
  connect();
  connectMongodb();
  console.log(`Example app listening on port ${port}`);
});
