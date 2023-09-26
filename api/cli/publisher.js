const mqtt = require('mqtt');
const { DHT, options, LED, PAN ,MANUALLY} = require('./topic');

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
const publishLedStatus = async (deviceId, status) => {
  const message = status ? '1' : '0'; 
  client.publish(LED, message, { qos: 1, retain: true });

  console.log(`Đã publish trạng thái của đèn ${deviceId}: ${message}`);
}

const publishPanStatus = async (deviceId, status) => {
  const message = status ? '1' : '0'; 
  client.publish(PAN, message, { qos: 1, retain: true });

  console.log(`Đã publish trạng thái của PAN ${deviceId}: ${message}`);
}

const publishManuallyStatus = async (deviceId, status) => {
  const message = status ? '1' : '0'; 
  client.publish(MANUALLY, message, { qos: 1, retain: true });

  console.log(`Đã publish trạng thái của Manually ${deviceId}: ${message}`);
}
module.exports = { connect, client, publishLedStatus, publishPanStatus,publishManuallyStatus };
