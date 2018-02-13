import rp from 'request-promise';
import winston from 'winston';

export default class WindowsGraphUsersRetriever {
  getUsers(endpointId, accessToken, uriOverride) {
    const users = [];

    // Note:
    // Unable to reduce the volume of data returned as
    // https://graph.microsoft.com/beta/users
    //   ?select=id,displayName,jobTitle,department,userPrincipalName,city,state,country,mail,businessPhones,manager
    //   &expand=manager
    // does not seem to return the manager.
    // Also, query string 'filter=accountEnabled eq true' seems to cause manager to not return.
    const getUsersUri = uriOverride || 'https://graph.microsoft.com/beta/users?expand=manager';

    winston.info(`Retrieving ${getUsersUri} ...`);

    return rp({
      uri: getUsersUri,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      json: true
    })
    .then(res => {
      users.push(...res.value.filter(x => x.accountEnabled).map(x => this.toAppUser(x)));

      // Recursively follow '@odata.nextLink' on response if it exists
      // to get all pages of data.
      const nextLink = res['@odata.nextLink'];

      if (nextLink) {
        return this
          .getUsers(
            endpointId,
            accessToken,
            nextLink)
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
      id: graphUser.id,
      displayName: graphUser.displayName,
      jobTitle: graphUser.jobTitle,
      department: graphUser.department,
      userPrincipalName: graphUser.userPrincipalName,
      city: graphUser.city,
      state: graphUser.state,
      country: graphUser.country,
      email: graphUser.mail,
      businessPhones: graphUser.businessPhones,
      manager: this.toAppUser(graphUser.manager)
    };
  }
}
