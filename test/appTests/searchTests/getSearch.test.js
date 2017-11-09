'use strict';

const httpMocks = require('node-mocks-http');
const getSearch = require('./../../../src/app/search/getSearch');

describe('when rendering initial search page', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      csrfToken: () => { return 'token'; },
    };

    res = httpMocks.createResponse();
  });

  it('then it should render search view', () => {
    getSearch(req, res);

    expect(res._getRenderView()).toBe('search/views/search');
  });

  it('then it should render an empty model', () => {
    getSearch(req, res);

    const model = res._getRenderData()
    expect(model).not.toBeNull();
    expect(model.csrfToken).toBe('token');
    expect(model.criteria).toBe('');
    expect(model.users).toBeNull();
  });
});