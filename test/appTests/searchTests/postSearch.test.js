jest.mock('./../../../src/app/search/searchAdapter', () => {
  return {
    searchForUsers: jest.fn().mockReturnValue([]),
  };
});

const httpMocks = require('node-mocks-http');
const postSearch = require('./../../../src/app/search/postSearch');

describe('when handling search request', () => {
  let req;
  let res;
  let searchAdapter;

  beforeEach(() => {
    req = {
      csrfToken: () => {
        return 'token';
      },
      body: {
        criteria: 'someuser',
        system: 'ABC',
      }
    };

    res = httpMocks.createResponse();

    searchAdapter = require('./../../../src/app/search/searchAdapter');
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
    searchAdapter.searchForUsers.mockReturnValue(users);

    await postSearch(req, res);

    const model = res._getRenderData();
    expect(model.users).toBe(users);
  });

  it('then it search using posted system and critria', async () => {
    await postSearch(req, res);

    expect(searchAdapter.searchForUsers.mock.calls.length).toBe(1);
    expect(searchAdapter.searchForUsers.mock.calls[0][0]).toBe('ABC');
    expect(searchAdapter.searchForUsers.mock.calls[0][1]).toBe('someuser');
  });
});