/* eslint-disable no-console */

import express from 'express';
import compression from 'compression';

import AccessTokenRetriever from './access-token-retriever';
import ConfigurationProvider from './configuration-provider';
import WindowsGraphUsersRetriever from './windows-graph-users-retriever';

export default class Main {
  constructor() {
    this.configuration = new ConfigurationProvider().getConfiguration();

    const defaultPort = 8081;

    this.app = express();
    this.port = process.env.port || defaultPort;

    this.directoryItems = [];
    this.isRefreshing = false;
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

    return new AccessTokenRetriever()
      .getAccessToken(
        this.configuration.endpointId,
        this.configuration.clientId,
        this.configuration.clientSecret)
      .then(accessToken => new WindowsGraphUsersRetriever()
        .getUsers(this.configuration.endpointId, accessToken))
      .then(users => {
        this.directoryItems = users;
        this.isRefreshing = false;
      })
      .catch(x => {
        this.isRefreshing = false;
        return x;
      });
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
