const searchAdapter = require('./searchAdapter');

const action = async (req, res) => {
  const system = req.body.system;
  const criteria = req.body.criteria;

  const users = await searchAdapter.searchForUsers(system, criteria);

  res.render('search/views/search', {
    csrfToken: req.csrfToken(),
    system,
    criteria,
    users,
  });
};

module.exports = action;
