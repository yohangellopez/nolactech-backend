const jwt = require('jsonwebtoken');
require('dotenv').config()
module.exports = (req, res, next) => {
  try {
    
   
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.split(' ').length === 2) {
      token = authHeader.split(' ')[1];
    } else {
      token = null;
    }

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado o formato incorrecto' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.id;
    
    if (req.body.id && req.body.id !== id) {
      console.log('Invalid user ID');
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch(err) {
    console.log(err);
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};