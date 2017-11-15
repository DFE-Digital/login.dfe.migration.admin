'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });

const getConfirm = require('./getConfirm');
const postConfirm = require('./postConfirm');

const routes = () => {
  router.get('/:username', getConfirm);
  router.post('/:username', postConfirm);

  return router;
};

module.exports = routes;