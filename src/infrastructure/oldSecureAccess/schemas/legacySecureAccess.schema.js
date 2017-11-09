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

const userToGroupMapping = db.define('safe_user_to_user_group', {
  safe_user: {
    type: Sequelize.BIGINT,
  },
  user_group: {
    type: Sequelize.BIGINT,
  },
}, {
  tableName: 'safe_user_to_user_group',
  timestamps  : false,
});

const groups = db.define('user_group', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
  },
  code: {
    type: Sequelize.BIGINT,
  },
  application: {
    type: Sequelize.STRING,
  },
}, {
  tableName: 'user_group',
  timestamps  : false,
});

const applications = db.define('customer_application', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
}, {
  tableName: 'customer_application',
  timestamps  : false,
});


users.belongsTo(organisations, { as: 'org', foreignKey: 'organisation' });
users.belongsToMany(groups, { as: 'groups', through: 'safe_user_to_user_group', foreignKey: 'safe_user', otherKey: 'user_group' });

module.exports = {
  users,
  organisations,
  userToGroupMapping,
  groups,
  applications
};
