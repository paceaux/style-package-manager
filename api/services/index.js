/**
 * DON'T MESS WITH THIS FILE
 * This allows services to be automagically added and instantiated
 */
const serviceFiles = require('require-dir')();
const { database, aql } = require('../database');

const services = {};

Object.values(serviceFiles).forEach((Service) => {
  const serviceObj = {};
  const serviceName = `${Service.name.slice(0, 1).toLowerCase()}${Service.name.substring(1)}`;
  serviceObj[serviceName] = new Service(database, aql);
  Object.assign(services, serviceObj);
});

module.exports = services;
