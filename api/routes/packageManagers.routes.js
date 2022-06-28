const express = require('express');

const router = express.Router();

const { packageManagerService } = require('../services');

router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Request received at /package-managers');
  next();
});

router.get('/package-managers', async (req, res) => {
  let result = null;
  try {
    result = await packageManagerService.getAll();
  } catch (error) {
    result = {
      error: "Couldn't retrieve all packages",
    };
    res.status(500);
  }

  return res.send(result);
});

router.get('/package-manager/:id', async (req, res) => {
  let result = null;
  try {
    result = await packageManagerService.get(req.params.id);
  } catch (error) {
    result = error;
    res.status(404);
  }
  return res.send(result);
});

router.delete('/package-manager/:id', async (req, res) => {
  const result = await packageManagerService.delete(req.params.id);
  return res.send(result);
});

router.put('/package-manager/:id', async (req, res) => {
  let result = null;
  try {
    result = await packageManagerService.update(req.params.id, req.body);
  } catch (error) {
    result = error.message;
    res.status(400);
  }
  return res.send(result);
});

router.post('/package-manager', async (req, res) => {
  let result = null;
  try {
    result = await packageManagerService.create(req.body);
  } catch (error) {
    result = error.message;
    res.status(400);
  }
  return res.send(result);
});

module.exports = {
  packageManagerRouter: router,
};
