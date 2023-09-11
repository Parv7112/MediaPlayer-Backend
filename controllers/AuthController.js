const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');
const AuthModel = require('../models/AuthModel');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendUserData = (req, res) => {
  const idToken = req.body.token;
  const userData = req.body.userData;

  console.log('Received ID token:', idToken);
  console.log('Received userData:', userData);

  // Verify the Firebase ID token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;

      // Create a new instance of AuthModel with user data
      const newAuth = new AuthModel({
        uid: uid,
        displayName: userData.displayName,
        email: userData.email,
        // Add any other user data fields here
      });

      // Save the newAuth instance to the database
      await newAuth.save();

      res.json({ success: true, message: 'User data saved successfully' });
    })
    .catch((error) => {
      // Handle error
      console.error('Error verifying Firebase ID token:', error);
      res.status(401).json({ success: false, message: 'Unauthorized' });
    });
};
