/* eslint-disable no-magic-numbers */

import CachingImageRetriever from '../../src/server/caching-image-retriever';

class TestImageRetriever {
  constructor(getImageReturnValue) {
    this.getImageReturnValue = getImageReturnValue;
  }

  getImage() {
    return Promise.resolve(typeof this.getImageReturnValue === 'function'
      ? this.getImageReturnValue()
      : this.getImageReturnValue);
  }
}

test('constructor throws error for missing imageRetriever', () => {
  expect(() => new CachingImageRetriever()).toThrowError('imageRetriever must be specified.');
});

test('constructor throws error for invalid fileOrMemory value', () => {
  expect(() => new CachingImageRetriever({ }, 'abc')).toThrowError('file or memory must be specified.');
});

test('getImage returns null promise for no email', () => {
  return new CachingImageRetriever({ }, 'memory')
    .getImage(null)
    .then(image => {
      expect(image).toBe(null);
    });
});

test('getImage returns item from image retriever when no cache match', () => {
  const testImage = 'ABC';

  return new CachingImageRetriever(new TestImageRetriever(testImage), 'memory')
    .getImage('test@example.com')
    .then(image => {
      expect(image).toBe(testImage);
    });
});

test('getImage returns cache match as a Buffer', () => {
  let counter = 0;
  const testImageFunction = () => (++counter).toString();

  const sut = new CachingImageRetriever(new TestImageRetriever(testImageFunction), 'memory');

  return sut
    .getImage('test@example.com')
    .then(() => {
      sut.getImage('test@example.com')
        .then(image => {
          expect(new Buffer('1').equals(image)).toBe(true);
        });
    });
});

test('clear removes all cached items', () => {
  const testImage = 'ABC';

  const sut = new CachingImageRetriever(new TestImageRetriever(testImage), 'memory');

  return sut.getImage()
    .then(image => {
      expect(sut.cache.load(testImage)).toBe(image);

      sut.clear();

      expect(sut.cache.load(testImage)).toBe(null);
    });
});
