import rp from 'request-promise';

export default class WindowsGraphUsersRetriever {
  getUsers(endpointId, accessToken, uriOverride) {
    const users = [];

    const apiVersion = 'api-version=2013-04-05';
    const baseUri = `https://graph.windows.net/${endpointId}`;
    const getUsersUri = uriOverride || (`${baseUri}/users`
      + `?${apiVersion}&$filter=accountEnabled eq true&$top=100&$expand=manager`);

    console.log(`Retrieving ${getUsersUri} ...`); // eslint-disable-line no-console

    return rp({
      uri: getUsersUri,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      json: true
    })
    .then(res => {
      users.push(...res.value.map(x => this.toAppUser(x)));

      // Recursively follow 'odata.nextLink' on response if it exists
      // to get all pages of data.
      const nextLink = res['odata.nextLink'];

      if (nextLink) {
        return this
          .getUsers(
            endpointId,
            accessToken,
            `${baseUri}/${nextLink}&${apiVersion}`)
          .then(nextUsers => {
            users.push(...nextUsers);
          });
      }

      return Promise.resolve(true);
    })
    .then(() => {
      return users;
    });
  }

  toAppUser(graphUser) {
    if (!graphUser) {
      return null;
    }

    return {
      id: graphUser.objectId,
      displayName: graphUser.displayName,
      jobTitle: graphUser.jobTitle,
      department: graphUser.department,
      userPrincipalName: graphUser.userPrincipalName,
      city: graphUser.city,
      state: graphUser.state,
      country: graphUser.country,
      email: graphUser.mail,
      telephoneNumber: graphUser.telephoneNumber,
      manager: this.toAppUser(graphUser.manager)
    };
  }
}
