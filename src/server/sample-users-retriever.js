/* eslint-disable no-magic-numbers */

import Chance from 'chance';
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
    const chance = new Chance();
    const first = chance.first();
    const last = chance.last();
    const email = `${first}.${last}@example.com`;

    return {
      id: i,
      displayName: `${first} ${last}`,
      jobTitle: 'Employee',
      department: department,
      userPrincipalName: email,
      city: i % 2 === 0 ? 'Harrisburg' : 'New York',
      state: i % 2 === 0 ? 'PA' : 'NY',
      country: 'USA',
      email: email,
      telephoneNumber: chance.phone()
    };
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  _getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
