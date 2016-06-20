import test from 'ava';
import fetchMock from 'fetch-mock';

import Directory from '../src/directory';

test.afterEach(() => {
  fetchMock.restore();
});

test.serial('Calls directoryUrl', t => {
  const testDirectoryUrl = 'directory-test-url';

  fetchMock.mock(testDirectoryUrl, { });

  return new Directory()
    .getUsers(testDirectoryUrl)
    .then(() => {
      t.true(fetchMock.called(testDirectoryUrl));
    });
});

test.serial('Uses filterFunction when supplied', t => {
  const testDirectoryUrl = 'directory-test-url';
  const testFilterFunction = x => x.test === 'b';

  fetchMock.mock(testDirectoryUrl, [{ test: 'a' }, { test: 'b' }]);

  return new Directory()
    .getUsers(testDirectoryUrl, testFilterFunction)
    .then(users => {
      t.is(users.length, 1); // eslint-disable-line no-magic-numbers
      t.is(users[0].test, 'b');
    });
});
