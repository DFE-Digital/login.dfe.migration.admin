const users = [
  {
    firstName: 'Frank',
    lastName: 'Castle',
    email: 'frank.castle@retribution.test',
    username: 'punisher',
    organisation: {
      id: 'org1',
      name: 'Some LA',
    },
    services: [
      {
        id: 'kts',
        name: 'Key to Success',
        role: {
          name: 'End User',
        },
      },
    ],
  },
];

const searchForUsers = async criteria => users.filter(user => user.email.toLowerCase().includes(criteria.toLowerCase())
  || user.username.toLowerCase().includes(criteria.toLowerCase()));

const getUserByUsername = async username => users.find(user => user.username.toLowerCase() === username.toLowerCase());

module.exports = {
  searchForUsers,
  getUserByUsername,
};
