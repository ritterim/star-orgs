/* eslint-disable no-console */

import express from 'express';
import compression from 'compression';

export default class WebServer {
  constructor(directoryItems, refreshFunction) {
    const defaultPort = 8081;

    this.directoryItems = directoryItems;
    this.refreshFunction = refreshFunction;
    this.port = process.env.port || defaultPort;
    this.app = express();
  }

  start() {
    const app = this.app;

    app.use(compression());

    app.get('/directory', (req, res) => {
      res.json(this.directoryItems);
    });

    app.get('/refresh', (req, res) => {
      this.refreshFunction()
        .catch(err => {
          console.error(err);
        });

      res.send('Refresh request received. <a href="/">Return to organizational chart</a>');
    });

    app.use(express.static('public'));

    app.listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });
  }
}
