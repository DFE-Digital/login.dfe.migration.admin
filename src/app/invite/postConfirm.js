const oldSecureAccess = require('./../../infrastructure/oldSecureAccess');
const config = require('./../../infrastructure/config');
const MigrationAdminJobsClient = require('login.dfe.migration.admin.jobs.client');

const jobsClient = new MigrationAdminJobsClient({
  connectionString: config.jobs.connectionString,
});

const action = async (req, res) => {
  const user = await oldSecureAccess.getUserByUsername(req.params.username);

  const services = user.services.map(service => ({
    organisationId: user.organisation.id,
    serviceId: service.id,
    roleId: service.role.id,
  }));
  await jobsClient.sendInvite(user.email, user.firstName, user.lastName, services, user.username, user.password, user.salt);

  res.flash('info', `Successfully invited ${user.email}`);
  res.redirect('/');
};

module.exports = action;
