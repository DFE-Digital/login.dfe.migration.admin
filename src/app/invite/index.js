'use strict';

const express = require('express');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const router = express.Router({ mergeParams: true });

const getConfirm = require('./getConfirm');
const postConfirm = require('./postConfirm');

const routes = () => {
  router.get('/:system/:username', asyncWrapper(getConfirm));
  router.post('/:system/:username', asyncWrapper(postConfirm));

  return router;
};

module.exports = routes;
