const config = require('./../../config');
const Sequelize = require('sequelize');
const assert = require('assert');

assert(config.eas.params, 'Must provide connection params for EAS');

const databaseName = config.eas.params.name || 'postgres';
const encryptDb = config.eas.params.encrypt || false;
const dbSchema = config.eas.params.schema || 'dbo';

let db;
if (config.eas.params.connectionString) {
  db = new Sequelize(config.eas.params.connectionString);
} else {
  assert(config.eas.params.username, 'Database property username must be supplied');
  assert(config.eas.params.password, 'Database property password must be supplied');
  assert(config.eas.params.host, 'Database property host must be supplied');
  assert(config.eas.params.dialect, 'Database property dialect must be supplied, this must be postgres or mssql');


  db = new Sequelize(databaseName, config.eas.params.username, config.eas.params.password, {
    host: config.eas.params.host,
    dialect: config.eas.params.dialect,
    dialectOptions: {
      encrypt: encryptDb,
    },
  });
}

const ktsUsers = db.define('KTSUsers', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  firstName: {
    type: Sequelize.STRING
  },
  surname: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  logonName: {
    type: Sequelize.STRING
  },
  ktsId: {
    type: Sequelize.STRING
  },
}, {
  tableName: 'KTSUsers',
  timestamps: false,
  schema: dbSchema,
});

module.exports = {
  ktsUsers,
};
