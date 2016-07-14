import test from 'ava';
const proxyquire = require('proxyquire').noCallThru();

import GravatarImageRetriever from '../../src/server/gravatar-image-retriever';

test('getImage should return promise resolving to null for no email', t => {
  return new GravatarImageRetriever()
    .getImage()
    .then(result => {
      t.is(result, null);
    });
});

test('getImage should return expected image', t => {
  const testImageData = 123;
  const testRequestPromise = () => Promise.resolve({
    statusCode: 200,
    body: testImageData
  });

  const TestGravatarImageRetriever = proxyquire(
    '../../src/server/gravatar-image-retriever',
    { 'request-promise': testRequestPromise }
  ).default;

  return new TestGravatarImageRetriever()
    .getImage('test@example.com')
    .then(img => {
      t.is(img, testImageData);
    });
});
