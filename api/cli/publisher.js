const mqtt = require('mqtt');
const { DHT, options } = require('./topic');

const client = mqtt.connect(options);

const connect = async () => {
  try {
    client.on('error', function (error) {
      console.log(error);
    });

    // Sự kiện khi kết nối thành công
    client.on('connect', () => {
      console.log('Đã kết nối thành công đến MQTT Broker');
      client.subscribe([DHT], () => {
        console.log(`Subscribe to topic ${DHT}`);
      });
    });

    // client.on('message', (receivedTopic, message) => {
    //   // Xử lý dữ liệu nhận được ở đây nếu cần
    // });
    client.on('close', () => {
      console.log('Kết nối đã đóng');
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { connect, client };
