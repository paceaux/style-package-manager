const express = require('express');
const cors = require('cors');

const routes = require('./routes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

Object.values(routes).forEach((route) => {
  app.use('/', route);
});
// eslint-disable-next-line no-console
app.listen(9191, () => console.log('Server is running on port 9191'));
