'use strict';

const express = require('express');

const router = express.Router({ mergeParams: true });

const getConfirm = require('./getConfirm');
const postConfirm = require('./postConfirm');

const routes = () => {
  router.get('/:system/:username', getConfirm);
  router.post('/:system/:username', postConfirm);

  return router;
};

module.exports = routes;
