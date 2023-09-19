const express = require('express');
const http = require('http'); // Import the http module
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./connections/db.js');
const RoomRouter = require('./router/RoomRouter.js');
const MusicRouter = require('./router/MusicRouter.js');
const AuthRouter = require('./router/AuthRouter.js');

const app = express();
const server = http.createServer(app);

const port = 4000

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Pass the 'server' to the socket.io constructor
const io = socketIo(server, {
  cors: {
    origin: {port},
    methods: ["GET", "POST"]
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/room', RoomRouter);
app.use('/music', MusicRouter);
app.use('/auth', AuthRouter);

connectDB();

io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  // Listen for the 'joinRoom' event
  socket.on('joinRoom', (roomId) => {
    // Join the room using socket.io rooms
    socket.join(roomId);
    // socket.to(roomId).emit(currentSong)
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle other socket events as needed

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected from socket:', socket.id);
  });
});

server.listen(4000, () => {
  console.log(`Server is running on ${port}`);
});
