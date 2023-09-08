const { v4 } = require('uuid');

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const MusicModel = require('../models/MusicModel');
let uui = '';

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        uui = v4()
        const filename = `${uui}${path.extname(file.originalname)}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });

const uploadAudio = async (req, res) => {
    try {
        const { originalname, filename } = req.file;
        const path = `uploads/${filename}`;

        const audio = new MusicModel({
            name: originalname,
            uniqueId: uui,
            path: path,
        });

        await audio.save();

        res.status(201).json({ message: 'Audio file uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllAudio = async (req, res) => {
    try {
        const audioFiles = await MusicModel.find({}, '-path');
        res.json(audioFiles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAudioById = async (req, res) => {
    try {
      const { uniqueId } = req.params;
      const result = await MusicModel.findOne({ uniqueId });
      const filePath = result.path
        
      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `inline; uniqueId="${uniqueId}"`);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      } else {
        res.status(404).send('File not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const deleteAudioById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const audio = await MusicModel.findById(id);
  
      if (!audio) {
        return res.status(404).json({ message: 'Audio not found' });
      }
  
      await audio.deleteOne();
  
      const filePath = path.join(__dirname, '..', audio.path);
      fs.unlinkSync(filePath);
  
      res.json({ message: 'Audio file deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {
    MusicController: {
        uploadAudio,
        getAllAudio,
        getAudioById,
        deleteAudioById,
    },
    upload,
};
