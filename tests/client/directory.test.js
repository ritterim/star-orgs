import fetchMock from 'fetch-mock';

import Directory from '../../src/client/directory';

afterEach(() => {
  fetchMock.restore();
});

test('Calls directoryUrl', () => {
  const testDirectoryUrl = 'directory-test-url';

  fetchMock.mock(testDirectoryUrl, { });

  return new Directory()
    .getUsers(testDirectoryUrl)
    .then(() => {
      expect(fetchMock.called(testDirectoryUrl)).toBe(true);
    });
});
