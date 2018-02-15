const config = require('./../config');

let adapter;
if (config.eas.type === 'sequelize') {
  adapter = require('./sequelize');
} else if (config.eas.type === 'static') {
  adapter = require('./static');
} else {
  throw new Error(`Invalid eas type ${config.eas.type}. Allowed values are sequelize & static`)
}

module.exports = adapter;