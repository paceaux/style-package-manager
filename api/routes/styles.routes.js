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

router.get('/style/:styleId', async (req, res) => {
  const results = await fileService.getByStyleId(req.params.styleId);
  return res.send(results[0]);
});

router.get('/style/:styleId/all', async (req, res) => {
  const results = await fileService.getByStyleId(req.params.styleId);
  return res.send(results);
});

router.get('/style/:styleId/:version', async (req, res) => {
  const versions = await fileService.getByStyleId(req.params.styleId);
  let result = null;

  if (versions.length === 1) {
    [result] = versions;
  }

  if (versions.length > 1) {
    [result] = versions.filter((fileVersion) => fileVersion.version == req.params.version);
  }

  return res.send(result);
});

router.delete('/style/:id', async (req, res) => {
  const result = await fileService.delete(req.params.id);
  return res.send(result);
});

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
