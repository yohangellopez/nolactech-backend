const jwt = require('jsonwebtoken');

module.exports = function(roles) {
    return (req, res, next) => {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const role = decodedToken.user.role;
        if (!roles.includes(role)) {
          return res.status(403).json({ msg: 'Access denied' });
        }
        next();
      }catch(err){
        console.log(err);
        res.status(401).json({
          error: new Error('Invalid Request!')
        });
      }
     
    };
  };
  