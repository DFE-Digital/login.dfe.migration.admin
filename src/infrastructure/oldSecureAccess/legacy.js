'use strict';

const { Op } = require('sequelize');
const { users, organisations } = require('./schemas/legacySecureAccess.schema');

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
    return userEntities.map((user) => {
      return {
        firstName: 'fix',// user.dataValues.first_name,
        lastName: 'this', // user.dataValues.last_name,
        email: user.dataValues.email,
        username : user.dataValues.username,
        organisation: {
          name: user.org.dataValues.name
        }
      }
    });
  }
  catch (e) {
    throw e;
  }
  return Promse.reject('not implemented');
};

const getUserByUsername = async (username) => {
  return Promse.reject('not implemented');
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