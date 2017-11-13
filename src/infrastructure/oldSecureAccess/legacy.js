'use strict';

const { Op } = require('sequelize');
const { users, organisations } = require('./schemas/legacySecureAccess.schema');

const mapUserEntity = (user) => {
  return {
    firstName: 'fix',// user.dataValues.first_name,
    lastName: 'this', // user.dataValues.last_name,
    email: user.dataValues.email,
    username : user.dataValues.username,
    organisation: {
      name: user.org.dataValues.name
    }
  }
}

const searchForUsers = async (criteria) => {
  try {
    const userEntities = await users.findAll({
      where: {
        [Op.or]: [
          {username: {[Op.like]: `%${criteria}%`}},
          {email: {[Op.like]: `%${criteria}%`}},
        ]
      },
      include: ['org']
    });
    return userEntities.map(mapUserEntity);
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
      include: ['org']
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


/*

<td><%=user.firstName%> <%=user.lastName.toUpperCase()%></td>
                <td><%=user.email%></td>
                <td><%=user.username%></td>
                <td><%=user.organisation.name%></td>
                <td><a href="/invite/<%=user.username%>">Invite</a></td>
 */