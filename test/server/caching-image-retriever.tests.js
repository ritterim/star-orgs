/* eslint-disable no-magic-numbers */

import test from 'ava';

import CachingImageRetriever from '../../src/server/caching-image-retriever';

export class TestImageRetriever {
  constructor(getImageReturnValue) {
    this.getImageReturnValue = getImageReturnValue;
  }

  getImage() {
    return Promise.resolve(typeof this.getImageReturnValue === 'function'
      ? this.getImageReturnValue()
      : this.getImageReturnValue);
  }
}

test('constructor throws error for missing imageRetriever', t => {
  t.throws(
    () => new CachingImageRetriever(),
    'imageRetriever must be specified.');
});

test('constructor throws error for invalid fileOrMemory value', t => {
  t.throws(
    () => new CachingImageRetriever({ }, 'abc'),
    'file or memory must be specified.');
});

test('getImage returns null promise for no email', t => {
  return new CachingImageRetriever({ }, 'memory')
    .getImage(null)
    .then(image => {
      t.is(image, null);
    });
});

test('getImage returns item from image retriever when no cache match', t => {
  const testImage = 'ABC';

  return new CachingImageRetriever(new TestImageRetriever(testImage), 'memory')
    .getImage('test@example.com')
    .then(image => {
      t.is(image, testImage);
    });
});

test('getImage returns cache match as a Buffer', t => {
  let counter = 0;
  const testImageFunction = () => (++counter).toString();

  const sut = new CachingImageRetriever(new TestImageRetriever(testImageFunction), 'memory');

  return sut
    .getImage('test@example.com')
    .then(() => {
      sut.getImage('test@example.com')
        .then(image => {
          t.true(new Buffer('1').equals(image));
        });
    });
});

test('clear removes all cached items', t => {
  const testImage = 'ABC';

  const sut = new CachingImageRetriever(new TestImageRetriever(testImage), 'memory');

  return sut.getImage()
    .then(image => {
      t.is(sut.cache.load(testImage), image);

      sut.clear();

      t.is(sut.cache.load(testImage), null);
    });
});
