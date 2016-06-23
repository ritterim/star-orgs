# star-orgs

Azure Active Directory Organization Chart Viewer

## Usage

- Install [Node.js](https://nodejs.org) and npm *(if they are not already installed)*.
- Configure Azure Active Directory:
  - Enable client credentials authentication
  - Allow necessary directory access
- Clone this repository, or download and extract it.
- Next, in the repository root folder create a `.env` text file matching the following:

```
ENDPOINT_ID=the_endpoint_id_value
CLIENT_ID=the_client_id_value
CLIENT_SECRET=the_client_secret_value
```

- Install and start:

```sh
> npm install
> npm start
```

## Development notes

The application consists of two components, a *client* and a *server*.

For local development `npm run start:watch` can be useful. This will watch both `src/client` and `src/server` directories and react as necessary. For `src/server` changes the server will be restarted -- which includes retrieving data as part of server startup.

## Author

Ritter Insurance Marketing https://rimdev.io

## License

- **MIT** : http://opensource.org/licenses/MIT

## Contributing

Contributions are highly welcome!
