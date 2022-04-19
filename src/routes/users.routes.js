const express = require('express');

const router = express.Router();

const { userService } = require('../services');
const { authenticateToken } = require('../utils/auth');

router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Request received at /users');
  next();
});

router.get('/user/:id', authenticateToken, async (req, res) => {
  const result = await userService.get(req.params.id);
  return res.send(result);
});

router.delete('/user/:id', async (req, res) => {
  let result = null;
  try {
    result = await userService.delete(req.params.id);
  } catch (error) {
    result = {
      error: error.message,
    };
    switch (error.message) {
      case 'Data missing: No id provided':
        res.status(400);
        break;
      default:
        res.status(500);
        break;
    }
  }
  return res.send(result);
});

router.put('/user/:id', async (req, res) => {
  let result = null;
  try {
    result = await userService.update(req.params.id, req.body);
  } catch (error) {
    result = {
      error: error.message,
    };
    switch (error.message) {
      case 'Data missing: No id provided':
        res.status(400);
        break;
      case 'Data missing: No user data provided':
        res.status(400);
        break;
      case 'User data: Email already exists':
        res.status(409);
        break;
      default:
        res.status(500);
        break;
    }
  }
  return res.send(result);
});

router.post('/user', async (req, res) => {
  let result = null;

  try {
    result = await userService.create(req.body);
  } catch (error) {
    result = {
      error: error.message,
    };
    switch (error.message) {
      case 'Data missing':
        res.status(400);
        break;
      case 'Data missing: No email or password provided':
        res.status(400);
        break;
      case 'User data: Email already exists':
        res.status(409);
        break;
      default:
        res.status(500);
        break;
    }
  }
  return res.send(result);
});

module.exports = {
  userRouter: router,
};
