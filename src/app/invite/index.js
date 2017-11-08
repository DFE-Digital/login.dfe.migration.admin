'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });

const getConfirm = require('./getConfirm');

const routes = () => {
  router.get('/:username', getConfirm);

  return router;
};

module.exports = routes;