const oldSecureAccess = require('./../../infrastructure/oldSecureAccess');
const eas = require('./../../infrastructure/eas');

const searchForUsers = async (system, criteria) => {
  if (system === 'EAS') {
    return await eas.searchForUsers(criteria);
  }
  return await oldSecureAccess.searchForUsers(criteria);
};

module.exports = {
  searchForUsers
};
