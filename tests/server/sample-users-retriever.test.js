import SampleUsersRetriever from '../../src/server/sample-users-retriever';

test('getUsers should return expected users count', () => {
  const numberOfUsers = 3;

  return new SampleUsersRetriever()
    .getUsers(numberOfUsers)
    .then(users => {
      expect(users.length).toBe(numberOfUsers);
    });
});

test('getUsers should return expected number of departments', () => {
  const numberOfDepartments = 10;

  return new SampleUsersRetriever()
    .getUsers(100, numberOfDepartments) // eslint-disable-line no-magic-numbers
    .then(users => {
      const distinctDepartments = Array.from(new Set(users.map(u => u.department)));

      expect(distinctDepartments.length).toBe(numberOfDepartments);
    });
});
