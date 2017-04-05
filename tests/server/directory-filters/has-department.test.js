/* eslint-disable no-magic-numbers */

import HasDepartment from '../../../src/server/directory-filters/has-department';

test('filter removes items without a department set', () => {
  const items = [
    { id: 1 }
  ];

  const results = new HasDepartment().filter(items);

  expect(results.length).toBe(0);
});

test('filter does not remove items with a department set', () => {
  const items = [
    { id: 1, department: 'Some Department' }
  ];

  const results = new HasDepartment().filter(items);

  expect(results.length).toBe(1);
  expect(results[0].id).toBe(1);
});
