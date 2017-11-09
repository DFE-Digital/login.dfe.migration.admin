'use strict';

const { Op } = require('sequelize');
const { users, organisations } = require('./schemas/legacySecureAccess.schema');

const searchForUsers = async (criteria) => {
  const userEntities = await users.find({
    where: {
      [Op.or]: [
        { username: criteria },
        { email: criteria },
      ],
    },
    include: ['organisation']
  });
  return Promse.reject('not implemented');
};

const getUserByUsername = async (username) => {
  return Promse.reject('not implemented');
};

module.exports = {
  searchForUsers,
  getUserByUsername,
};