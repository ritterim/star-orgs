/* eslint-disable no-magic-numbers */

import IgnoreList from '../../../src/server/directory-filters/ignore-list';

beforeEach(() => {
  delete process.env.IGNORE_LIST;
});

test('filter should remove items matching id specified in process.env.IGNORE_LIST', () => {
  process.env.IGNORE_LIST = 'abc';

  const items = [
    { id: 'abc' }
  ];

  const results = new IgnoreList().filter(items);

  expect(results.length).toBe(0);
});

test('filter should remove items matching email specified in process.env.IGNORE_LIST', () => {
  process.env.IGNORE_LIST = 'test@example.com';

  const items = [
    { id: 'abc', email: 'test@example.com' }
  ];

  const results = new IgnoreList().filter(items);

  expect(results.length).toBe(0);
});

test('filter should not remove items not specified in process.env.IGNORE_LIST', () => {
  process.env.IGNORE_LIST = 'test';

  const items = [
    { id: 'abc' }
  ];

  const results = new IgnoreList().filter(items);

  expect(results.length).toBe(1);
  expect(results[0].id).toBe('abc');
});
