const config = require('./../../config');
const Sequelize = require('sequelize');
const assert = require('assert');
const Op = Sequelize.Op;

const getIntValueOrDefault = (value, defaultValue = 0) => {
  if (!value) {
    return defaultValue;
  }
  const int = parseInt(value);
  return isNaN(int) ? defaultValue : int;
};

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

  const dbOpts = {
    retry: {
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /TimeoutError/,
      ],
      name: 'query',
      backoffBase: 100,
      backoffExponent: 1.1,
      timeout: 60000,
      max: 5,
    },
    host: config.eas.params.host,
    dialect: config.eas.params.dialect,
    operatorsAliases: Op,
    dialectOptions: {
      encrypt: encryptDb,
    },
  };
  if (config.eas.params.pool) {
    dbOpts.pool = {
      max: getIntValueOrDefault(config.eas.params.pool.max, 5),
      min: getIntValueOrDefault(config.eas.params.pool.min, 0),
      acquire: getIntValueOrDefault(config.eas.params.pool.acquire, 10000),
      idle: getIntValueOrDefault(config.eas.params.pool.idle, 10000),
    };
  }

  db = new Sequelize(databaseName, config.eas.params.username, config.eas.params.password, dbOpts);
}

const ktsUsers = db.define('KTSUsers', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  surname: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  logonName: {
    type: Sequelize.STRING,
  },
  ktsId: {
    type: Sequelize.STRING,
  },
  serialNumber: {
    type: Sequelize.STRING,
  },
}, {
  tableName: 'KTSUsers',
  timestamps: false,
  schema: dbSchema,
});

module.exports = {
  ktsUsers,
};
