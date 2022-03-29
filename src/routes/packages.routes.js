const express = require('express');

const router = express.Router();

const { packageService } = require('../services');

router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Request received at /packages');
  next();
});

router.get('/packages', async (req, res) => {
  let result = null;
  try {
    result = await packageService.getAll();
  } catch (error) {
    result = {
      error: 'whoops',
    };
  }

  return res.send(result);
});

router.get('/package/:id', async (req, res) => {
  const result = await packageService.get(req.params.id);
  return res.send(result);
});

router.delete('/package/:id', async (req, res) => {
  const result = await packageService.delete(req.params.id);
  return res.send(result);
});

router.put('/package/:id', async (req, res) => {
  const result = await packageService.update(req.params.id, req.body);
  return res.send(result);
});

router.post('/package', async (req, res) => {
  let result = null;
  try {
    result = await packageService.create(req.body);
  } catch (error) {
    result = error.message;
    res.status(400);
  }
  return res.send(result);
});

module.exports = {
  packageRouter: router,
};
