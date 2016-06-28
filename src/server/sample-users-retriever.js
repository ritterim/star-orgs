/* eslint-disable no-magic-numbers */

import randgen from 'randgen';

export default class SampleUsersRetriever {
  getUsers(numberOfUsers, numberOfDepartments = 1) {
    const users = [];

    // Create users without managers set
    for (let i = 0; i < numberOfUsers; i++) {
      const user = this.getAppUser(
        i,
        `Department ${this._getRandomIntInclusive(1, numberOfDepartments)}`);

      users.push(user);
    }

    // Set managers
    const managerIdLookup = randgen.histogram(
      randgen.rvnorm(numberOfUsers),
      numberOfUsers);

    for (let i = 1; i < numberOfUsers; i++) {
      const currentUser = users[i];
      const manager = users[managerIdLookup[i]];

      // Prevent potential self-references
      if (manager.id === currentUser.id) {
        currentUser.manager = users[0];
      } else {
        currentUser.manager = manager;
      }
    }

    return Promise.resolve(users);
  }

  getAppUser(i, department) {
    return {
      id: i,
      displayName: '{{ displayName }}',
      jobTitle: '{{ job_title }}',
      department: department,
      userPrincipalName: `${i}@example.com`,
      city: 'New York',
      state: 'NY',
      country: 'USA',
      email: `${i}@example.com`,
      telephoneNumber: '555-555-1212'
    };
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  _getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
