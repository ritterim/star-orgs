const testImageData = 123;
const testRequestPromise = () => Promise.resolve({
  statusCode: 200,
  body: testImageData
});

jest.mock('request-promise');
const requestPromise = require('request-promise');
requestPromise.mockImplementation(testRequestPromise);

const GravatarImageRetriever = require('../../src/server/gravatar-image-retriever');

test('getImage should return promise resolving to null for no email', () => {
  return new GravatarImageRetriever()
    .getImage()
    .then(result => {
      expect(result).toBe(null);
    });
});

test('getImage should return expected image', () => {
  return new GravatarImageRetriever()
    .getImage('test@example.com')
    .then(img => {
      expect(img).toBe(testImageData);
    });
});
