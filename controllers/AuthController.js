const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');
const AuthModel = require('../models/AuthModel');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendUserData = (req, res) => {
  const idToken = req.body.token;
  const userData = req.body.userData;

  // console.log('Received ID token:', idToken);
  console.log('Received userData:', userData);

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      const email = userData.email;

      // Check if a user with the same email already exists in the database
      const existingUser = await AuthModel.findOne({ email });

      if (existingUser) {
        // If a user with the same email exists, do not save the data again
        res.json({ success: false, message: 'User with this email already exists' });
      } else {
        // If the user with the email doesn't exist, save the data
        const newAuth = new AuthModel({
          uid: uid,
          displayName: userData.displayName,
          email: email,
        });

        await newAuth.save();

        res.json({ success: true, message: 'User data saved successfully' });
      }
    })
    .catch((error) => {
      console.error('Error verifying Firebase ID token:', error);
      res.status(401).json({ success: false, message: 'Unauthorized' });
    });
};
