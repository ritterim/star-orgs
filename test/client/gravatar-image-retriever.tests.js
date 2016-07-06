import test from 'ava';

import GravatarImageRetriever from '../../src/client/gravatar-image-retriever';

test('constructor should throw for missing picturePxSize value', t => {
  t.throws(() => new GravatarImageRetriever());
});

test('getImageUrl should return null for no email', t => {
  const result = new GravatarImageRetriever('150px').getImageUrl();

  t.is(result, null);
});

test('getImageUrl should return expected hash in url', t => {
  const result = new GravatarImageRetriever('150px').getImageUrl('test@example.com');

  t.regex(result, /55502f40dc8b7c769880b10874abc9d0/);
});

test('getImageUrl should use this.picturePxSize', t => {
  const result = new GravatarImageRetriever('150px').getImageUrl('test@example.com');

  t.regex(result, /s=150px/);
});
