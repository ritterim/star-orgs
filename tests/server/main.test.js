/* eslint-disable no-magic-numbers */

let winston;

let endpointId;

class MockAccessTokenRetriever {
  getAccessToken() {
    return Promise.resolve('test_access_token');
  }
}

class MockAccessTokenCheckingFakeWindowsGraphUsersRetriever {
  getUsers(endpointId, accessToken /* , uriOverride */) {
    if (accessToken !== 'test_access_token') {
      throw new Error('Access token did not match expected value.');
    }

    return Promise.resolve([{ id: 'test-id' }]);
  }
}

class MockConfigurationProvider {
  getConfiguration() {
    return {
      endpointId: endpointId,
      clientId: undefined,
      clientSecret: undefined,
      imageRetriever: undefined,
      logoUrl: undefined,
      office365GetPersonaPhotoCookie: undefined
    };
  }
}

class MockUsersRetriever {
  getUsers() {
    return Promise.resolve([{ id: 'test-id' }]);
  }
}

process.env.PORT = 0;

beforeEach(() => {
  endpointId = undefined;

  jest.resetModules();

  const mockConfigurationProvider = new MockConfigurationProvider();
  jest.mock('../../src/server/configuration-provider', () => jest.fn(() => mockConfigurationProvider))

  winston = require('winston');
  winston.level = 'error';
});

test('start should start web server with directory items', () => {
  jest.mock('../../src/server/web-server');

  const webServer = require('../../src/server/web-server');

  const Main = require('../../src/server/main');

  return new Main(/* useInMemoryCache: */ true).start()
    .then(() => {
      expect(webServer.mock.calls.length).toBe(1);
    });
});

test('refreshData should use SampleUsersRetriever when process.env.ENDPOINT_ID is not set', () => {
  const mockUsersRetriever = new MockUsersRetriever();

  jest.mock('../../src/server/sample-users-retriever', () => jest.fn(() => mockUsersRetriever));

  const Main = require('../../src/server/main');

  const main = new Main(/* useInMemoryCache: */ true);

  return main.refreshData()
    .then(() => {
      expect(main.directoryItems.length).toBe(1);
      expect(main.directoryItems[0].id).toBe('test-id');
    });
});

test('refreshData should use WindowsGraphUsersRetriever when process.env.ENDPOINT_ID is set', () => {
  endpointId = 'test';

  const mockAccessTokenRetriever = new MockAccessTokenRetriever();
  const mockUsersRetriever = new MockUsersRetriever();

  jest.mock('../../src/server/access-token-retriever', () => jest.fn(() => mockAccessTokenRetriever));
  jest.mock('../../src/server/windows-graph-users-retriever', () => jest.fn(() => mockUsersRetriever));

  const Main = require('../../src/server/main');

  const main = new Main(/* useInMemoryCache: */ true);

  return main.refreshData()
    .then(() => {
      expect(main.directoryItems.length).toBe(1);
      expect(main.directoryItems[0].id).toBe('test-id');
    });
});

test('refreshData should provide correct access token to WindowsGraphUsersRetriever', () => {
  endpointId = 'test';

  const mockAccessTokenRetriever = new MockAccessTokenRetriever();
  const mockAccessTokenCheckingFakeWindowsGraphUsersRetriever = new MockAccessTokenCheckingFakeWindowsGraphUsersRetriever();

  jest.mock('../../src/server/access-token-retriever', () => jest.fn(() => mockAccessTokenRetriever));
  jest.mock('../../src/server/windows-graph-users-retriever', () => jest.fn(() => mockAccessTokenCheckingFakeWindowsGraphUsersRetriever));

  const Main = require('../../src/server/main');

  const main = new Main(/* useInMemoryCache: */ true);

  // If AccessTokenCheckingFakeWindowsGraphUsersRetriever throws
  // main.directoryItems should not be set.
  return main.refreshData()
    .then(() => {
      expect(main.directoryItems.length).toBe(1);
      expect(main.directoryItems[0].id).toBe('test-id');
    });
});

test('clearImages should clear cached images', () => {
  jest.mock('../../src/server/caching-image-retriever');

  const cachingImageRetriever = require('../../src/server/caching-image-retriever');

  const Main = require('../../src/server/main');

  const main = new Main(/* useInMemoryCache: */ true);

  return main.clearImages()
    .then(() => {
      expect(cachingImageRetriever.mock.calls.length).toBe(1);
    });
});
