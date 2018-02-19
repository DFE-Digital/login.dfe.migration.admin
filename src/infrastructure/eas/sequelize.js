const { ktsUsers } = require('./schemas/easKtsSchema');
const { Op } = require('sequelize');
const config = require('./../config');

const searchForUsers = async (criteria) => {
  const userEntities = await ktsUsers.findAll({
    where: {
      [Op.or]: [
        { logonName: { [Op.like]: `%${criteria}%` } },
        { email: { [Op.like]: `%${criteria}%` } },
      ],
    },
  });

  return userEntities.map((entity) => {
    return {
      firstName: entity.dataValues.firstName,
      lastName: entity.dataValues.surname,
      email: entity.dataValues.email,
      username: entity.dataValues.logonName,
      organisation: {
        id: '72711ff9-2da1-4135-8a20-3de1fea31073',
        name: 'Local Authority',
      },
      services: [{
        id: '',
        name: 'Key to Success',
        role: { id: 0, name: 'End user' },
      }],
      tokenSerialNumber: entity.dataValues.serialNumber,
    };
  });
};

const getUserByUsername = async (username) => {
  const userEntity = await ktsUsers.find({
    where: {
      logonName: {
        [Op.eq]: username,
      },
    },
  });
  if (!userEntity) {
    return null;
  }

  return {
    firstName: userEntity.dataValues.firstName,
    lastName: userEntity.dataValues.surname,
    email: userEntity.dataValues.email,
    username: userEntity.dataValues.logonName,
    organisation: {
      id: config.eas.laOrganisationId,
      name: 'Local Authority',
    },
    services: [{
      id: config.eas.ktsServiceId,
      name: 'Key to Success',
      role: { id: 0, name: 'End user' },
    }],
    tokenSerialNumber: userEntity.dataValues.serialNumber,
  };
};

module.exports = {
  searchForUsers,
  getUserByUsername,
};
