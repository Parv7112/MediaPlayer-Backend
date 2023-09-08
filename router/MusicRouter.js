const express = require('express');
const router = express.Router();
const MusicController = require('../controllers/MusicController');

const uploadAudio = MusicController.MusicController.uploadAudio; 
const getAllAudio = MusicController.MusicController.getAllAudio; 
const getAudioById = MusicController.MusicController.getAudioById
const deleteAudioById = MusicController.MusicController.deleteAudioById; 

const upload = MusicController.upload; 

router.post('/upload', upload.single('audio'), uploadAudio);
router.get('/getMusic', getAllAudio);
router.get('/getMusic/:uniqueId', getAudioById);
router.delete('/delete/:id', deleteAudioById); 

module.exports = router;