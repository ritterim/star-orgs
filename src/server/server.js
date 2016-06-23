/* eslint-disable no-console */

import express from 'express';
import compression from 'compression';
import rp from 'request-promise';

import ConfigurationProvider from './configuration-provider';

export default class Server {
  constructor() {
    this.configuration = new ConfigurationProvider().getConfiguration();

    const defaultPort = 8081;

    this.app = express();
    this.port = process.env.port || defaultPort;

    this.directoryItems = [];

    this.isRefreshing = false;
    this.newDirectoryItems = [];
  }

  start() {
    return this.refreshData()
      .then(() => this.startExpress())
      .catch(err => {
        console.error(err);
        process.exit(-1); // eslint-disable-line no-process-exit, no-magic-numbers
      });
  }

  refreshData() {
    if (this.isRefreshing) {
      return Promise.resolve(true);
    }

    this.isRefreshing = true;

    this.newDirectoryItems = [];

    return this.getAccessToken()
      .then(accessToken => this.hydrateDirectoryItems(accessToken))
      .then(() => (this.isRefreshing = false))
      .catch(x => {
        this.isRefreshing = false;
        return x;
      });
  }

  getAccessToken() {
    console.log('Retrieving access token ...');

    return rp({
      method: 'POST',
      uri: `https://login.microsoftonline.com/${this.configuration.endpointId}/oauth2/token`,
      form: {
        grant_type: 'client_credentials',
        client_id: this.configuration.clientId,
        client_secret: this.configuration.clientSecret,
        resource: 'https://graph.windows.net'
      },
      json: true
    }).then(res => res.access_token);
  }

  hydrateDirectoryItems(accessToken, uriOverride) {
    const apiVersion = 'api-version=2013-04-05';
    const baseUri = `https://graph.windows.net/${this.configuration.endpointId}`;
    const getUsersUri = `${baseUri}/users?${apiVersion}&$filter=accountEnabled eq true&$top=100&$expand=manager`;

    console.log(`Retrieving results [${this.newDirectoryItems.length} items retrieved so far] ...`);

    return rp({
      uri: uriOverride || getUsersUri,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      json: true
    })
    .then(res => {
      this.newDirectoryItems.push(...res.value.map(x => this.toAppUser(x)));

      // Recursively follow "odata.nextLink" on response if it exists
      // to get all pages of data.
      const nextLink = res['odata.nextLink'];

      if (nextLink) {
        return this.hydrateDirectoryItems(accessToken, `${baseUri}/${nextLink}&${apiVersion}`);
      }
    })
    .then(() => {
      // Only assign directoryItems for the outermost invocation
      if (!uriOverride) {
        console.log(`${this.newDirectoryItems.length} total items retrieved.`);
        this.directoryItems = this.newDirectoryItems;
      }
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

  startExpress() {
    this.app.use(compression());

    this.app.get('/directory', (req, res) => {
      res.json(this.directoryItems);
    });

    this.app.get('/refresh', (req, res) => {
      this.refreshData()
        .catch(err => {
          console.error(err);
        });

      res.send('Refresh request received. <a href="/">Return to organizational chart</a>');
    });

    this.app.use(express.static('public'));

    this.app.listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });
  }
}
