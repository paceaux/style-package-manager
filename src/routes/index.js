/**
 * DON'T MESS WITH THIS FILE
 * This allows routes to be automagically added to the server
 */
const routeFiles = require('require-dir')();

const routes = {};

Object.values(routeFiles).forEach((exportedObject) => {
  Object.assign(routes, exportedObject);
});

module.exports = routes;
