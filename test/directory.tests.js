import test from 'ava';
import fetchMock from 'fetch-mock';

import Directory from '../src/directory';

test('Calls directoryUrl', t => {
  const testDirectoryUrl = 'directory-test-url';

  fetchMock.mock(testDirectoryUrl, { });

  return new Directory()
    .getUsers(testDirectoryUrl)
    .then(() => {
      t.true(fetchMock.called(testDirectoryUrl));
    });
});
