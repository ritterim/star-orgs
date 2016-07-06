/* eslint-disable no-magic-numbers */

import test from 'ava';
import winston from 'winston';
const proxyquire = require('proxyquire').noCallThru();

test.before(() => {
  winston.level = 'error';
});

test('getUsers should return expected single page of results', t => {
  const testRequestPromise = function () {
    return Promise.resolve({
      value: [{}, {}]
    });
  };

  const WindowsGraphUsersRetriever = proxyquire(
    '../../src/server/windows-graph-users-retriever',
    { 'request-promise': testRequestPromise }
  ).default;

  return new WindowsGraphUsersRetriever()
    .getUsers('example.com', 'the_access_token')
    .then(users => {
      t.is(users.length, 2);
    });
});

test('getUsers should follow \'odata.nextLink\'', t => {
  const testNextLink = 'test-next-link';

  const testRequestPromise = function (args) {
    if (args.uri.includes(testNextLink)) {
      return Promise.resolve({
        value: [{}]
      });
    }

    return Promise.resolve({
      value: [{}, {}],
      'odata.nextLink': testNextLink
    });
  };

  const WindowsGraphUsersRetriever = proxyquire(
    '../../src/server/windows-graph-users-retriever',
    { 'request-promise': testRequestPromise }
  ).default;

  return new WindowsGraphUsersRetriever()
    .getUsers('example.com', 'the_access_token')
    .then(users => {
      t.is(users.length, 3);
    });
});

