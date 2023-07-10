const axios = require('axios');
const config = require('config');
async function authMiddleware(req, res, next) {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    console.log('token: '+token);
    var validateTokenResult = await axios.post(config.AuthAddress + `/api/auth/validateToken`, { token: token });
    if (validateTokenResult.data === true) {
      next();

    } else {
      res.status(401).json({ message: 'Invalid token' });
    }

  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
