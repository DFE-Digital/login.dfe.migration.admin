'use strict';

const { uniqBy } = require('lodash');
const { Op } = require('sequelize');
const { users, applications } = require('./schemas/legacySecureAccess.schema');

const roleMapping = [
  { osa: 'end_user', nsa: { id: 0, name: 'End user' } },
  { osa: 'approver', nsa: { id: 10000, name: 'Approver' } },
];

const mapUserEntity = async (user) => {
  const userApplications = uniqBy(user.groups.map((group) => {
    return {
      id: group.application,
    };
  }), (item) => {
    return item.id;
  }).filter((application) => application.id !== 1);

  const userRoles = user.groups.filter((group) => group.application == 1)
    .map((group) => {
      return roleMapping.find((mapping) => mapping.osa === group.code);
    }).sort((x, y) => {
      if (x == null) {
        return 1;
      }
      if (x.nsa.id > y.nsa.id) {
        return -1;
      }
      if (x.nsa.id < y.nsa.id) {
        return 1;
      }
      return 0;
    });

  const services = (await Promise.all(userApplications.map(async (application) => {
    const applicationEntity = await applications.find({
      where: {
        id: {
          [Op.eq]: application.id,
        },
      },
    });
    return {
      id: application.id,
      name: applicationEntity.dataValues.name,
      role: userRoles[0].nsa,
    };
  }))).sort((x, y) => {
    if (x.name < y.name) {
      return -1;
    }
    if (x.name > y.name) {
      return 1;
    }
    return 0;
  });

  return {
    firstName: 'fix',// user.dataValues.first_name,
    lastName: 'this', // user.dataValues.last_name,
    email: user.dataValues.email,
    username: user.dataValues.username,
    organisation: {
      name: user.org.dataValues.name
    },
    services,
  }
};

const searchForUsers = async (criteria) => {
  try {
    const userEntities = await users.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${criteria}%` } },
          { email: { [Op.like]: `%${criteria}%` } },
        ]
      },
      include: ['org', 'groups']
    });
    return await Promise.all(userEntities.map(mapUserEntity));
  }
  catch (e) {
    throw e;
  }
};

const getUserByUsername = async (username) => {
  try {
    const userEntity = await users.find({
      where: {
        username: {
          [Op.eq]: username,
        },
      },
      include: ['org', 'groups']
    });
    return mapUserEntity(userEntity);
  }
  catch (e) {
    throw e;
  }
};

module.exports = {
  searchForUsers,
  getUserByUsername,
};