jest.mock('./../../../src/infrastructure/oldSecureAccess', () => {
  return {
    searchForUsers: jest.fn().mockReturnValue([]),
  };
});

const httpMocks = require('node-mocks-http');
const postSearch = require('./../../../src/app/search/postSearch');

describe('when handling search request', () => {
  let req;
  let res;
  let oldSecureAccess;

  beforeEach(() => {
    req = {
      csrfToken: () => {
        return 'token';
      },
      body: {
        criteria: 'someuser',
      }
    };

    res = httpMocks.createResponse();

    oldSecureAccess = require('./../../../src/infrastructure/oldSecureAccess');
  });

  it('then it should render search view', async () => {
    await postSearch(req, res);

    expect(res._getRenderView()).toBe('search/views/search');
  });

  it('then it should render a model', async () => {
    await postSearch(req, res);

    const model = res._getRenderData();
    expect(model).not.toBeNull();
  });

  it('then it should render csrf token in model', async () => {
    await postSearch(req, res);

    const model = res._getRenderData();
    expect(model.csrfToken).toBe('token');
  });

  it('then it should render submitted criteria in model', async () => {
    await postSearch(req, res);

    const model = res._getRenderData();
    expect(model.criteria).toBe('someuser');
  });

  it('then it should render users in model', async () => {
    const users = [{
      firstName: 'Test',
      lastName: 'Testerton',
      email: 'test.testerton@unit.test',
      username: 'testy',
      organisation: 'Test Inc',
      services: [
        {
          id: 'svc1',
          name: 'Service One',
          role: {
            name: 'Approver',
          },
        },
        {
          id: 'svc2',
          name: 'Service Two',
          role: {
            name: 'End User',
          },
        },
      ],
    }];
    oldSecureAccess.searchForUsers.mockReturnValue(users);

    await postSearch(req, res);

    const model = res._getRenderData();
    expect(model.users).toBe(users);
  });
});