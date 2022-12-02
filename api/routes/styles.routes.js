const express = require('express');

const router = express.Router();

const { fileService } = require('../services');

router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Request received at /styles');
  next();
});

// router.get('/styles', async (req, res) => {
//   let result = null;
//   try {
//     result = await fileService.getAll();
//   } catch (error) {
//     result = {
//       error: 'whoops',
//     };
//   }

//   return res.send(result);
// });

router.get('/style/:name', async (req, res) => {
  const result = await fileService.getLatest(req.params.name);
  return res.send(result);
});

router.get('/style/:name/all', async (req, res) => {
  const result = await fileService.getByName(req.params.name);
  return res.send(result);
});

router.get('/style/:name/:version', async (req, res) => {
  const versions = await fileService.getByName(req.params.name);
  let result = null;

  if (versions.length === 1) {
    [result] = versions;
  }

  if (versions.length > 1) {
    [result] = versions.filter((fileVersion) => fileVersion.version == req.params.version);
  }

  return res.send(result);
});

// router.delete('/style/:id', async (req, res) => {
//   const result = await fileService.delete(req.params.id);
//   return res.send(result);
// });

// router.put('/style/:id', async (req, res) => {
//   const result = await fileService.update(req.params.id, req.body);
//   return res.send(result);
// });

// router.post('/file', async (req, res) => {
//   let result = null;
//   try {
//     result = await fileService.create(req.body);
//   } catch (error) {
//     result = error.message;
//     res.status(400);
//   }
//   return res.send(result);
// });

module.exports = {
  styleRouter: router, // eslint-disable-line no-unused-vars
};
