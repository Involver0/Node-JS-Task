const jwt = require('jsonwebtoken');

module.exports = {
  authenticate: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const user = jwt.verify(token, 'abc123');
      req.user = user;
      next();
    } catch (error) {
      console.error(error);

      res.status(401).send({ error: 'Token is bad' });
    }
  },
};
