const oldSecureAccess = require('./../../infrastructure/oldSecureAccess');

const action = async (req, res) => {
  const user = await oldSecureAccess.getUserByUsername(req.params.username);

  res.render('invite/views/confirm', {
    csrfToken: req.csrfToken(),
    user,
  });
};

module.exports = action;