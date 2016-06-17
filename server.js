require('dotenv').config();

const endpointId = process.env.ENDPOINT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const express = require('express');
const app = express();
const compression = require('compression');
const port = process.env.port || 8081;

const rp = require('request-promise');

let directoryItems = [];

let isRefreshing = false;
let newDirectoryItems = [];

refreshData()
  .then(() => startExpress())
  .catch(err => {
    console.error(err);
    process.exit(-1);
  });

//
// Functions
//

function refreshData() {
  if (isRefreshing) {
    return Promise.resolve(true);
  }

  isRefreshing = true;

  newDirectoryItems = [];

  return getAccessToken(endpointId, clientId, clientSecret)
    .then(accessToken => hydrateDirectoryItems(accessToken))
    .then(() => isRefreshing = false)
    .catch(x => {
      isRefreshing = false;
      return x;
    });
}

function getAccessToken(endpointId, clientId, clientSecret) {
  console.log('Retrieving access token ...');

  return rp({
    method: 'POST',
    uri: `https://login.microsoftonline.com/${endpointId}/oauth2/token`,
    form: {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      resource: 'https://graph.windows.net'
    },
    json: true
  }).then(res => res.access_token);
}

const apiVersion = 'api-version=2013-04-05';
const baseUri = `https://graph.windows.net/${endpointId}`;
const getUsersUri = `${baseUri}/users?${apiVersion}&$filter=accountEnabled eq true&$top=100&$expand=manager`;

function hydrateDirectoryItems(accessToken, uri = getUsersUri) {
  console.log(`Retrieving results [${newDirectoryItems.length} items retrieved so far] ...`);

  return rp({
    uri: uri,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    json: true
  })
  .then(res => {
    newDirectoryItems.push(...res.value.map(x => toAppUser(x)));

    // Recursively follow "odata.nextLink" on response if it exists
    // to get all pages of data.
    const nextLink = res['odata.nextLink'];
    if (nextLink) {
      return hydrateDirectoryItems(accessToken, `${baseUri}/${nextLink}&${apiVersion}`);
    }
  })
  .then(() => {
    // Only assign directoryItems for the outermost invocation
    if (uri === getUsersUri) {
      console.log(newDirectoryItems.length + ' total items retrieved.');
      directoryItems = newDirectoryItems;
    }
  });
}

function toAppUser(graphUser) {
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
    mobilePhoneNumber: graphUser.mobile,
    manager: toAppUser(graphUser.manager)
  };
}

function startExpress() {
  app.use(compression());

  app.get('/directory', (req, res) => {
    res.json(directoryItems);
  });

  app.get('/refresh', (req, res) => {
    refreshData()
      .catch(err => {
        console.error(err);
      });

    res.send('Refresh request received. <a href="/">Return to organizational chart</a>');
  });

  app.use(express.static('public'));

  app.listen(port, () => {
    console.log('Server listening on port: ' + port);
  });
}
