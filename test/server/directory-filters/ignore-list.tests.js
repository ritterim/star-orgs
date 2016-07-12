/* eslint-disable no-magic-numbers */

import test from 'ava';

import IgnoreList from '../../../src/server/directory-filters/ignore-list';

test.beforeEach(() => {
  delete process.env.IGNORE_LIST;
});

test('filter should remove items matching id specified in process.env.IGNORE_LIST', t => {
  process.env.IGNORE_LIST = 'abc';

  const items = [
    { id: 'abc' }
  ];

  const results = new IgnoreList().filter(items);

  t.is(results.length, 0);
});

test('filter should remove items matching email specified in process.env.IGNORE_LIST', t => {
  process.env.IGNORE_LIST = 'test@example.com';

  const items = [
    { id: 'abc', email: 'test@example.com' }
  ];

  const results = new IgnoreList().filter(items);

  t.is(results.length, 0);
});

test('filter should not remove items not specified in process.env.IGNORE_LIST', t => {
  process.env.IGNORE_LIST = 'test';

  const items = [
    { id: 'abc' }
  ];

  const results = new IgnoreList().filter(items);

  t.is(results.length, 1);
  t.is(results[0].id, 'abc');
});
