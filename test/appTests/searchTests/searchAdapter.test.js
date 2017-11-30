jest.mock('./../../../src/infrastructure/oldSecureAccess', () => {
  return {
    searchForUsers: jest.fn().mockReturnValue([{email: 'user.one@osa.test'}]),
  };
});
jest.mock('./../../../src/infrastructure/eas', () => {
  return {
    searchForUsers: jest.fn().mockReturnValue([{email: 'user.two@eas.test'}]),
  };
});

const searchAdapter = require('./../../../src/app/search/searchAdapter');

const criteria = 'user';

describe('when searching for users', () => {
  let oldSecureAccess;
  let eas;

  beforeEach(() => {
    oldSecureAccess = require('./../../../src/infrastructure/oldSecureAccess');
    eas = require('./../../../src/infrastructure/eas');
  });

  it('then it should search in old secure access if system is OSA', async () => {
    await searchAdapter.searchForUsers('OSA', criteria);

    expect(oldSecureAccess.searchForUsers.mock.calls.length).toBe(1);
    expect(oldSecureAccess.searchForUsers.mock.calls[0][0]).toBe(criteria);
  });

  it('then it should return users from old secure access if system is OSA', async () => {
    const actual = await searchAdapter.searchForUsers('OSA', criteria);

    expect(actual).not.toBeNull();
    expect(actual.length).toBe(1);
    expect(actual[0].email).toBe('user.one@osa.test');
  });

  it('then it should search in EAS if system is EAS', async () => {
    await searchAdapter.searchForUsers('EAS', criteria);

    expect(eas.searchForUsers.mock.calls.length).toBe(1);
    expect(eas.searchForUsers.mock.calls[0][0]).toBe(criteria);
  });

  it('then it should return users from EAS if system is EAS', async () => {
    const actual = await searchAdapter.searchForUsers('EAS', criteria);

    expect(actual).not.toBeNull();
    expect(actual.length).toBe(1);
    expect(actual[0].email).toBe('user.two@eas.test');
  });
});
