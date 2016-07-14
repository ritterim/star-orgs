/* eslint-disable no-magic-numbers */

import test from 'ava';
import winston from 'winston';
const proxyquire = require('proxyquire').noCallThru();

export class TestAccessTokenRetriever {
  getAccessToken() {
    return Promise.resolve('test_access_token');
  }
}

export class TestUsersRetriever {
  getUsers() {
    return Promise.resolve([{ id: 'test-id' }]);
  }
}

export class AccessTokenCheckingFakeWindowsGraphUsersRetriever {
  getUsers(endpointId, accessToken /* , uriOverride */) {
    if (accessToken !== 'test_access_token') {
      throw new Error('Access token did not match expected value.');
    }

    return Promise.resolve([{ id: 'test-id' }]);
  }
}

let cachingImageRetrieverClearInvoked = false;

export class TestCachingImageRetriever {
  constructor() {
    cachingImageRetrieverClearInvoked = false;
  }

  clear() {
    cachingImageRetrieverClearInvoked = true;
  }
}

let testWebServerStarted = false;

export class TestWebServer {
  constructor() {
    testWebServerStarted = false;
  }

  start() {
    testWebServerStarted = true;
  }
}

process.env.port = 0;

test.before(() => {
  winston.level = 'error';
});

test.beforeEach(() => {
  delete process.env.ENDPOINT_ID;
});

test('start should start web server with directory items', t => {
  const Main = proxyquire(
    '../../src/server/main',
    { './web-server': TestWebServer }
  ).default;
  const main = new Main(/* useInMemoryCache: */ true);

  return main.start()
    .then(() => {
      t.true(testWebServerStarted);
    });
});

test('refreshData should clear cached images', t => {
  const Main = proxyquire(
    '../../src/server/main',
    {
      './web-server': TestWebServer,
      './caching-image-retriever': TestCachingImageRetriever
    }
  ).default;
  const main = new Main(/* useInMemoryCache: */ true);

  return main.refreshData()
    .then(() => {
      t.true(cachingImageRetrieverClearInvoked);
    });
});

test('refreshData should use SampleUsersRetriever when process.env.ENDPOINT_ID is not set', t => {
  const Main = proxyquire(
    '../../src/server/main',
    { './sample-users-retriever': TestUsersRetriever }
  ).default;
  const main = new Main(/* useInMemoryCache: */ true);

  return main.refreshData()
    .then(() => {
      t.is(main.directoryItems.length, 1);
      t.is(main.directoryItems[0].id, 'test-id');
    });
});

test('refreshData should use WindowsGraphUsersRetriever when process.env.ENDPOINT_ID is set', t => {
  process.env.ENDPOINT_ID = 'test';

  const Main = proxyquire(
    '../../src/server/main',
    {
      './access-token-retriever': TestAccessTokenRetriever,
      './windows-graph-users-retriever': TestUsersRetriever
    }
  ).default;
  const main = new Main(/* useInMemoryCache: */ true);

  return main.refreshData()
    .then(() => {
      t.is(main.directoryItems.length, 1);
      t.is(main.directoryItems[0].id, 'test-id');
    });
});

test('refreshData should provide correct access token to WindowsGraphUsersRetriever', t => {
  process.env.ENDPOINT_ID = 'test';

  const Main = proxyquire(
    '../../src/server/main',
    {
      './access-token-retriever': TestAccessTokenRetriever,
      './windows-graph-users-retriever': AccessTokenCheckingFakeWindowsGraphUsersRetriever
    }
  ).default;
  const main = new Main(/* useInMemoryCache: */ true);

  // If AccessTokenCheckingFakeWindowsGraphUsersRetriever throws
  // main.directoryItems should not be set.
  return main.refreshData()
    .then(() => {
      t.is(main.directoryItems.length, 1);
      t.is(main.directoryItems[0].id, 'test-id');
    });
});
