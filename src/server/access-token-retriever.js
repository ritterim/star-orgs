import rp from 'request-promise';

export default class AccessTokenRetriever {
  getAccessToken(endpointId, clientId, clientSecret) {
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
}
