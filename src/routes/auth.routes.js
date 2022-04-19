const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const router = express.Router();

const { userService } = require('../services');

dotenv.config();

function generateAccessToken(user) {
  return jwt.sign(
    user,
    process.env.TOKEN_SECRET,
    {
      expiresIn: '2h',
    },
  );
}

router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Request received at /auth');
  next();
});

router.post('/authenticate', async (req, res) => {
  let result = null;
  try {
    const { email, password } = req.body;
    const shouldAuthenticate = await userService.checkUser(email, password);

    if (shouldAuthenticate) {
      const token = generateAccessToken({ email });
      result = token;
      res.status(202);
    } else {
      result = {
        message: 'Invalid email or password',
      };
      res.status(401);
    }
  } catch (error) {
    result = {
      error: error.message,
    };
    switch (error.message) {
      case 'Data missing: No email or password provided':
        res.status(400);
        break;
      case 'User: Not found':
        res.status(404);
        break;
      default:
        res.status(500);
        break;
    }
  }
  res.json(result);
});

module.exports = {
  authRouter: router,
};
