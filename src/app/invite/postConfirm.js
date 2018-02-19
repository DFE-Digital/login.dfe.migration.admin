const oldSecureAccess = require('./../../infrastructure/oldSecureAccess');
const eas = require('./../../infrastructure/eas');
const config = require('./../../infrastructure/config');
const MigrationAdminJobsClient = require('login.dfe.migration.admin.jobs.client');

const jobsClient = new MigrationAdminJobsClient({
  connectionString: config.jobs.connectionString,
});

const action = async (req, res) => {
  let user;
  if (req.params.system.toLowerCase() === 'eas') {
    user = await eas.getUserByUsername(req.params.username);
  } else if (req.params.system.toLowerCase() === 'osa') {
    user = await oldSecureAccess.getUserByUsername(req.params.username);
  } else {
    return res.status(400).send();
  }

  const services = user.services.map(service => ({
    organisationId: user.organisation.id,
    serviceId: service.id,
    roleId: service.role.id,
  }));
  await jobsClient.sendInvite(user.email, user.firstName, user.lastName, services, user.username, user.password, user.salt, user.tokenSerialNumber);

  res.flash('info', `Successfully invited ${user.email}`);
  res.redirect('/');
};

module.exports = action;
