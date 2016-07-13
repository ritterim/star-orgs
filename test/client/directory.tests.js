import test from 'ava';
import fetchMock from 'fetch-mock';

import Directory from '../../src/client/directory';

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
