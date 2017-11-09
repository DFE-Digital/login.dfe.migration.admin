const config = require('./../../config');
const Sequelize = require('sequelize');

if (!config.oldSecureAccess.params || !config.oldSecureAccess.params.legacyConnectionString) {
  throw new Error('Must provide config oldSecureAccess.params.legacyConnectionString')
}

const db = new Sequelize(config.oldSecureAccess.params.legacyConnectionString);

const users = db.define('safe_user', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
  },
  username: {
    type: Sequelize.STRING,
  },
  organisation: {
    type: Sequelize.BIGINT,
  },
}, {
  tableName: 'safe_user',
});

const organisations = db.define('organisation', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
}, {
  tableName: 'organisation',
});


users.hasOne(organisations, { as: 'organisation', foreignKey: 'organisation' });

module.exports = {
  users,
  organisations,
};
