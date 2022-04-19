const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function generateAccessToken(user) {
  if (!user) throw new Error('User not provided');
  return jwt.sign(
    user,
    process.env.TOKEN_SECRET,
    {
      expiresIn: '2h',
    },
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.TOKEN_SECRET);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  let status = 202;

  if (token == null) {
    status = 401;
  }

  try {
    const hasAccess = verifyAccessToken(token);
    if (!hasAccess) {
      status = 401;
    }
  } catch (error) {
    status = 403;
  }
  res.status(status);
  next();
}

module.exports = {
  authenticateToken,
  verifyAccessToken,
  generateAccessToken,
};
