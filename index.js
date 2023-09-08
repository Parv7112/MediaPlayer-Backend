const express = require('express');
const cors = require('cors');
const connectDB = require('./connections/db.js'); 
const RoomRouter = require('./router/RoomRouter.js');
const MusicRouter = require('./router/MusicRouter.js')
const bodyParser = require('body-parser');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/room', RoomRouter);
app.use('/music', MusicRouter);

connectDB();

app.listen(4000, () => {
  console.log(`Server is running on http://localhost:4000`);
});
