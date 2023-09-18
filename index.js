const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const connectDB = require('./connections/db.js'); 
const RoomRouter = require('./router/RoomRouter.js');
const MusicRouter = require('./router/MusicRouter.js');
const AuthRouter = require('./router/AuthRouter.js')
const bodyParser = require('body-parser');

const app = express();
const io = socketIo(server);
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/room', RoomRouter);
app.use('/music', MusicRouter);
app.use('/auth', AuthRouter);

connectDB();

const port = 4000

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
