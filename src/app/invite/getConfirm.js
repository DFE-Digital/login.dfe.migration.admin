const oldSecureAccess = require('./../../infrastructure/oldSecureAccess');
const eas = require('./../../infrastructure/eas');

const action = async (req, res) => {
  let user;
  if (req.params.system.toLowerCase() === 'eas') {
    user = await eas.getUserByUsername(req.params.username);
  } else if (req.params.system.toLowerCase() === 'osa') {
    user = await oldSecureAccess.getUserByUsername(req.params.username);
  } else {
    return res.status(400).send();
  }

  return res.render('invite/views/confirm', {
    csrfToken: req.csrfToken(),
    user,
  });
};

module.exports = action;
