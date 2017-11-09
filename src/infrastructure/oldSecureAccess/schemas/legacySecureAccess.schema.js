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
  first_name: {
    type: Sequelize.BLOB,
  },
  last_name: {
    type: Sequelize.BLOB,
  },

  organisation: {
    as: 'org_id',
    type: Sequelize.BIGINT,
  },
}, {
  tableName: 'safe_user',
  timestamps  : false,
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
  timestamps  : false,
});


users.belongsTo(organisations, { as: 'org', foreignKey: 'organisation' });

module.exports = {
  users,
  organisations,
};
