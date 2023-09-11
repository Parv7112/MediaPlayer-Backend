const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');

router.post('/sendUserData', authController.sendUserData);

module.exports = router;
