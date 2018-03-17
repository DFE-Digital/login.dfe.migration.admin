const fs = require('fs');
const { promisify } = require('util');
const MigrationAdminJobsClient = require('login.dfe.migration.admin.jobs.client');

const access = promisify(fs.access);
const readFile = promisify(fs.readFile);

const fileExists = async (filePath) => {
  try {
    await access(filePath, fs.constants.R_OK);
    return true;
  } catch (e) {
    return false;
  }
}
const readArgs = () => {
  const args = {
    usersCsvPath: '',
    jobsConnectionString: '',
  };

  process.argv.forEach((arg) => {
    if (!arg.startsWith('-')) {
      return;
    }

    const kvp = arg.split('=');
    if (kvp[0] === '--userspath') {
      args.usersCsvPath = kvp[1];
    } else if (kvp[0] === '--connectionstring') {
      args.jobsConnectionString = kvp[1];
    }
  });

  return args;
};
const readAndValidateArgs = async () => {
  const args = readArgs();

  if (!args.usersCsvPath) {
    throw new Error('Must supply --userspath');
  } else if (!await fileExists(args.usersCsvPath)) {
    throw new Error(`Cannot find file ${args.usersCsvPath}`);
  }

  if (!args.jobsConnectionString) {
    throw new Error('Must supply --connectionstring');
  }

  return args;
};

const splitName = (fullName) => {
  const lastSpaceIndex = fullName.lastIndexOf(' ');
  const firstName = fullName.substr(0, lastSpaceIndex);
  const lastName = fullName.substr(lastSpaceIndex + 1);
  return {
    firstName,
    lastName,
  };
};
const readCsvFile = async (filePath) => {
  const contents = await readFile(filePath, 'utf8');
  const lines = contents.split(/\r\n/).slice(1);
  return lines.map((line) => {
    const cells = line.split(',');
    return Object.assign({
      ktsId: cells[0],
      fullName: cells[1],
      email: cells[2],
      tokenSerialNumber: cells[3],
      username: cells[4]
    }, splitName(cells[1]));
  });
};

const run = async () => {
  const args = await readAndValidateArgs();
  const users = await readCsvFile(args.usersCsvPath);
  const services = [{
    organisationId: 'fa460f7c-8ab9-4cee-aaff-82d6d341d702',
    serviceId: '3bfde961-f061-4786-b618-618deaf96e44',
    roleId: 0,
  }];

  const jobsClient = new MigrationAdminJobsClient({
    connectionString: args.jobsConnectionString,
  });
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await jobsClient.sendInvite(user.email, user.firstName, user.lastName, services, user.username, null, null, user.tokenSerialNumber, user.ktsId);
    console.info(`Queued invite for ${user.email} (kts-id ${user.ktsId})`);
  }
};

run().then(() => {
  console.info('done');
}).catch((e) => {
  console.error(e.message);
});
