'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const router = express.Router({ mergeParams: true });

const routes = () => {
  router.get('/', (req, res) => {
    res.send('fdkjskljsfl');
  });

  return router;
};

module.exports = routes;