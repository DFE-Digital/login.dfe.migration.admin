'use strict';

const { uniqBy } = require('lodash');
const { Op } = require('sequelize');
const { users, applications } = require('./schemas/legacySecureAccess.schema');

const roleMapping = [
  { osa: 'end_user', nsa: { id: 0, name: 'End user' } },
  { osa: 'approver', nsa: { id: 10000, name: 'Approver' } },
];
const serviceMapping = [
  { code: 'KTS', id: '3bfde961-f061-4786-b618-618deaf96e44' },
  { code: 'COLLECT', id: 'fb27f118-c7cc-4ce4-a2aa-6255cfd34cf0' },
  { code: 'S2S', id: '8c3b6436-8249-4c73-8a35-fceb18cf7bf1' },
  { code: 'Edubase', id: 'da634158-f6ae-4b6a-903c-805be7fd5390' },
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
    }).filter((role) => role != null);

  const services = (await Promise.all(userApplications.map(async (application) => {
    const applicationEntity = await applications.find({
      where: {
        id: {
          [Op.eq]: application.id,
        },
      },
    });
    console.log(`looking for mapping for ${applicationEntity.code}`);
    const newAppMap = serviceMapping.find((x) => x.code === applicationEntity.code);
    if (!newAppMap) {
      return null;
    }
    return {
      id: newAppMap.id,
      name: applicationEntity.dataValues.name,
      role: userRoles.length > 0 ? userRoles[0].nsa : null,
    };
  }))).filter((x) => x != null).sort((x, y) => {
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
    password: user.dataValues.password,
    salt: user.dataValues.salt,
    organisation: {
      id: '72711ff9-2da1-4135-8a20-3de1fea31073',
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