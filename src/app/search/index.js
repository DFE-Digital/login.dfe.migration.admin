'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });

const getSearch = require('./getSearch');
const postSearch = require('./postSearch');

const routes = () => {
  router.get('/', getSearch);
  router.post('/', postSearch);

  return router;
};

module.exports = routes;