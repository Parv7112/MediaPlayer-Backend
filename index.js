const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./connections/db.js');
const RoomRouter = require('./router/RoomRouter.js');
const MusicRouter = require('./router/MusicRouter.js');
const AuthRouter = require('./router/AuthRouter.js');

const app = express();
const server = http.createServer(app);

const port = 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/room', RoomRouter);
app.use('/music', MusicRouter);
app.use('/auth', AuthRouter);

connectDB();

io.on('connection', (socket) => {
  const { id: socketId } = socket;

  console.log(`User connected to socket: ${socketId}`);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socketId} joined room ${roomId}`);
  });

  socket.on('playSong', ({ roomId, songIndex }) => {
    console.log('Received playSong event:', { roomId, songIndex });
    // Broadcast the 'playSong' event to all sockets in the same room
    socket.to(roomId).emit('playSong', { roomId, songIndex });

    console.log(`User ${socket.id} played song in room ${roomId}, songIndex ${songIndex}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected from socket: ${socketId}`);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
