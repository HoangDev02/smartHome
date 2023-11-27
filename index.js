const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
var cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override')

const dotenv = require('dotenv');
const connectMongodb = require('./api/connect/connect');
const {connect} = require('./api/cli/publisher')
const {subscriber} = require('./api/cli/subscriber');

const roomsRoutes = require('./api/routes/roomsRoutes')
const deviceRouter = require('./api/routes/deviceRouter');
const tempHumidityRouter = require('./api/routes/tempHumidityRouter');
const userRouter = require('./api/routes/userRouter')

const port = 3100;
dotenv.config();
const fs = require('fs'); // Thêm module này
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

//change text in jason
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(methodOverride('_method'))
app.use(morgan('combined'))


// app.use('/api/room', roomsRoutes)
app.use('/api/devices', deviceRouter);
app.use('/api/tempHumidity', tempHumidityRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send("IP Webcam Server");
  req.end()
});
process.on('uncaughtException', (error) => {
  console.error('Unhandled Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('stream', (image) => {
    socket.broadcast.emit('stream', image);
  });

  // Đăng ký trình xử lý lỗi cho mỗi socket
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Xử lý khi socket đóng kết nối
  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${reason}`);
  });

  // Xử lý lỗi đọc dữ liệu
  socket.on('close', (error) => {
    console.log(`Socket closed: ${error}`);
  });
});
server.listen(port, () => {
  subscriber();
  connect();
  connectMongodb();
  console.log(`Example app listening on port ${port}`);
});
