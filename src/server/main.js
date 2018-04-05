import winston from 'winston';
import AccessTokenRetriever from './access-token-retriever';
import ConfigurationProvider from './configuration-provider';
import CachingImageRetriever from './caching-image-retriever';
import GravatarImageRetriever from './gravatar-image-retriever';
import Office365GetPersonaPhotoImageRetriever from './office-365-get-persona-photo-image-retriever';
import WebServer from './web-server';
import SampleUsersRetriever from './sample-users-retriever';
import WindowsGraphUsersRetriever from './windows-graph-users-retriever';

export default class Main {
  constructor(useInMemoryCache = false) {
    this.configuration = new ConfigurationProvider().getConfiguration();

    const imageRetriever = this.configuration.imageRetriever === 'Office365GetPersonaPhotoImageRetriever'
      ? new Office365GetPersonaPhotoImageRetriever(this.configuration.office365GetPersonaPhotoCookie)
      : new GravatarImageRetriever();

    winston.info(`Using ${imageRetriever.constructor.name} for photos.`);

    this.cachingImageRetriever = new CachingImageRetriever(
      imageRetriever,
      useInMemoryCache ? 'memory' : 'file');

    this.directoryItems = [];
    this.isRefreshing = false;
  }

  start() {
    return this.refreshData()
      .then(() => {
        setInterval(
          () => this.refreshData(),
          this.configuration.refreshIntervalSeconds * 1000);

        new WebServer(
          this.directoryItems,
          this.cachingImageRetriever,
          () => this.refreshData(),
          () => this.clearImages(),
          this.configuration.logoUrl)
        .start();
      })
      .catch(err => {
        winston.error(err);
        process.exit(-1); // eslint-disable-line no-process-exit, no-magic-numbers
      });
  }

  refreshData() {
    if (!this.configuration.endpointId) {
      winston.warn('process.env.ENDPOINT_ID is not set, using SampleUsersRetriever ...');

      return new SampleUsersRetriever()
        .getUsers(50, 4) // eslint-disable-line no-magic-numbers
        .then(users => this.filterData(users))
        .then(users => {
          this.directoryItems = users;
        })
        .catch(err => {
          winston.error(err);
        });
    }

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
      .then(users => this.filterData(users))
      .then(users => {
        this.directoryItems = users;
        this.isRefreshing = false;
      })
      .catch(err => {
        winston.error(err);

        this.isRefreshing = false;
        return err;
      });
  }

  clearImages() {
    this.cachingImageRetriever.clear();

    return Promise.resolve(true);
  }

  filterData(users) {
    const filterNames = (process.env.DIRECTORY_FILTERS || '')
      .split(',')
      .filter(x => x)
      .map(x => x.trim());

    if (filterNames.length > 0) { // eslint-disable-line no-magic-numbers
      winston.info(`process.env.DIRECTORY_FILTERS specified: '${filterNames.join(', ')}'`);

      filterNames.forEach(filterName => {
        const FilterClass = require(`${__dirname}/directory-filters/${filterName}`);

        if (!FilterClass) {
          throw new Error(`${__dirname}/directory-filters/${filterName} could not be found.`);
        }

        users = new FilterClass().filter(users);
      });
    }

    return users;
  }
}
