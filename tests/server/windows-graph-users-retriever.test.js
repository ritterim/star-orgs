/* eslint-disable no-magic-numbers */

import winston from 'winston';

beforeAll(() => {
  winston.level = 'error';
});

test('getUsers should return expected single page of results', () => {
  const testRequestPromise = function () {
    return Promise.resolve({
      value: [{
        id: '1',
        accountEnabled: true
      }, {
        id: '2',
        accountEnabled: true
      }]
    });
  };

  jest.mock('request-promise');
  const requestPromise = require('request-promise');
  requestPromise.mockImplementation(testRequestPromise);

  const WindowsGraphUsersRetriever = require('../../src/server/windows-graph-users-retriever');

  return new WindowsGraphUsersRetriever()
    .getUsers('example.com', 'the_access_token')
    .then(users => {
      expect(users.length).toBe(2);
    });
});

test('getUsers should follow \'@odata.nextLink\'', () => {
  const testNextLink = 'test-next-link';

  const testRequestPromise = function (args) {
    if (args.uri.includes(testNextLink)) {
      return Promise.resolve({
        value: [{
          id: '3',
          accountEnabled: true
        }]
      });
    }

    return Promise.resolve({
      value: [{
        id: '1',
        accountEnabled: true
      }, {
        id: '2',
        accountEnabled: true
      }],
      '@odata.nextLink': testNextLink
    });
  };

  jest.mock('request-promise');
  const requestPromise = require('request-promise');
  requestPromise.mockImplementation(testRequestPromise);

  const WindowsGraphUsersRetriever = require('../../src/server/windows-graph-users-retriever');

  return new WindowsGraphUsersRetriever()
    .getUsers('example.com', 'the_access_token')
    .then(users => {
      expect(users.length).toBe(3);
    });
});
