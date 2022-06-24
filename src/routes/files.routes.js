const express = require('express');

const router = express.Router();

const { fileService } = require('../services');

router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Request received at /files');
  next();
});

router.get('/files', async (req, res) => {
  let result = null;
  try {
    result = await fileService.getAll();
  } catch (error) {
    result = {
      error: 'whoops',
    };
  }

  return res.send(result);
});

router.get('/file/:id', async (req, res) => {
  const result = await fileService.get(req.params.id);
  return res.send(result);
});

router.delete('/file/:id', async (req, res) => {
  const result = await fileService.delete(req.params.id);
  return res.send(result);
});

router.put('/file/:id', async (req, res) => {
  const result = await fileService.update(req.params.id, req.body);
  return res.send(result);
});

router.post('/file', async (req, res) => {
  let result = null;
  try {
    result = await fileService.create(req.body);
  } catch (error) {
    result = error.message;
    res.status(400);
  }
  return res.send(result);
});

module.exports = {
  fileRouter: router, // eslint-disable-line no-unused-vars
};
