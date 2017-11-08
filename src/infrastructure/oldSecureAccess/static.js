const users = [
  {
    firstName: 'Tony',
    lastName: 'Stark',
    email: 'tony.stark@stark-industries.test',
    username: 'ironman',
    organisation: 'Some School',
    services: [
      {
        id: 'svc1',
        name: 'Service One',
        role: {
          name: 'Approver',
        },
      },
      {
        id: 'svc2',
        name: 'Service Two',
        role: {
          name: 'End User',
        },
      },
    ],
  },
];

const searchForUsers = async (criteria) => {
  return users.filter((user) => {
    return user.email.toLowerCase() === criteria.toLowerCase()
      || user.username.toLowerCase() === criteria.toLowerCase();
  })
};

const getUserByUsername = async (username) => {
  return users.find((user) => user.username.toLowerCase() === username.toLowerCase());
};

module.exports = {
  searchForUsers,
  getUserByUsername,
};
