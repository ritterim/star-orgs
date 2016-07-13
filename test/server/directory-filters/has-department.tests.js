/* eslint-disable no-magic-numbers */

import test from 'ava';

import HasDepartment from '../../../src/server/directory-filters/has-department';

test('filter removes items without a department set', t => {
  const items = [
    { id: 1 }
  ];

  const results = new HasDepartment().filter(items);

  t.is(results.length, 0);
});

test('filter does not remove items with a department set', t => {
  const items = [
    { id: 1, department: 'Some Department' }
  ];

  const results = new HasDepartment().filter(items);

  t.is(results.length, 1);
  t.is(results[0].id, 1);
});
