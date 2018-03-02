'use strict';

const express = require('express');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const router = express.Router({ mergeParams: true });

const getSearch = require('./getSearch');
const postSearch = require('./postSearch');

const routes = () => {
  router.get('/', asyncWrapper(getSearch));
  router.post('/', asyncWrapper(postSearch));

  return router;
};

module.exports = routes;
