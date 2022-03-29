const express = require('express');

const router = express.Router();

const { userService } = require('../services');

router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Request received at /users');
  next();
});

router.get('/users', async (req, res) => {
  let result = null;
  try {
    result = await userService.getAll();
  } catch (error) {
    result = {
      error: 'whoops',
    };
  }

  return res.send(result);
});

router.get('/user/:id', async (req, res) => {
  const result = await userService.get(req.params.id);
  return res.send(result);
});

router.delete('/user/:id', async (req, res) => {
  const result = await userService.delete(req.params.id);
  return res.send(result);
});

router.put('/user/:id', async (req, res) => {
  const result = await userService.update(req.params.id, req.body);
  return res.send(result);
});

router.post('/user', async (req, res) => {
  let result = null;

  try {
    result = await userService.create(req.body);
  } catch (error) {
    result = error;
  }
  return res.send(result);
});

module.exports = {
  userRouter: router,
};
