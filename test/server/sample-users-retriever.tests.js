import test from 'ava';

import SampleUsersRetriever from '../../src/server/sample-users-retriever';

test('getUsers should return expected users count', t => {
  const numberOfUsers = 3;

  return new SampleUsersRetriever()
    .getUsers(numberOfUsers)
    .then(users => {
      t.is(users.length, numberOfUsers);
    });
});

test('getUsers should return expected number of departments', t => {
  const numberOfDepartments = 10;

  return new SampleUsersRetriever()
    .getUsers(100, numberOfDepartments) // eslint-disable-line no-magic-numbers
    .then(users => {
      const distinctDepartments = Array.from(new Set(users.map(u => u.department)));

      t.is(distinctDepartments.length, numberOfDepartments);
    });
});
