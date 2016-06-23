/* eslint-disable no-magic-numbers */

export default class RandomUsersRetriever {
  getUsers(numberOfUsers, numberOfDepartments = 1) {
    const users = [];

    // Add nodes to random parents
    for (let i = 0; i < numberOfUsers; i++) {
      const user = this.getAppUser(
        i,
        i === 0 ? null : this._getRandomIntInclusive(0, i),
        `Department ${this._getRandomIntInclusive(1, numberOfDepartments)}`);

      users.push(user);
    }

    return Promise.resolve(users);
  }

  getAppUser(i, managerId, department) {
    const user = {
      id: i,
      displayName: '{{ displayName }}',
      jobTitle: '{{ job_title }}',
      department: department,
      userPrincipalName: `${i}@example.com`,
      city: 'New York',
      state: 'NY',
      country: 'USA',
      email: `${i}@example.com`,
      telephoneNumber: '555-555-1212',
      manager: managerId ? this.getAppUser(managerId) : null
    };

    this.counter++;

    return user;
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  _getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
