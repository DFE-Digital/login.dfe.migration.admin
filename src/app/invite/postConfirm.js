const oldSecureAccess = require('./../../infrastructure/oldSecureAccess');

const action = async (req, res) => {
  const user = await oldSecureAccess.getUserByUsername(req.params.username);

  res.flash('info', `Successfully invited ${user.email}`);
  res.redirect('/');
};

module.exports = action;