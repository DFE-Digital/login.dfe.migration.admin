const oldSecureAccess = require('./../../infrastructure/oldSecureAccess');

const action = async (req, res) => {
  const criteria = req.body.criteria;

  const users = await oldSecureAccess.searchForUsers(criteria);

  res.render('search/views/search', {
    csrfToken: req.csrfToken(),
    criteria,
    users,
  });
};

module.exports = action;
