import dotenv from 'dotenv';

export default class ConfigurationProvider {
  constructor() {
    dotenv.config();
  }

  getConfiguration() {
    return {
      endpointId: process.env.ENDPOINT_ID,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    };
  }
}
