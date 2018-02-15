const { ktsUsers } = require('./schemas/easKtsSchema');
const { Op } = require('sequelize');

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
    };
  });
};

module.exports = {
  searchForUsers,
};
