import express from 'express';
import compression from 'compression';
import winston from 'winston';

export default class WebServer {
  constructor(directoryItems, refreshFunction, logoUrl) {
    const defaultPort = 8081;

    this.directoryItems = directoryItems;
    this.refreshFunction = refreshFunction;
    this.logoUrl = logoUrl;
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
          winston.error(err);
        });

      res.send('Refresh request received. <a href="/">Return to organizational chart</a>');
    });

    app.get('/logo', (req, res) => {
      res.redirect(this.logoUrl || 'logo.png');
    });

    app.use(express.static('public'));

    app.listen(this.port, () => {
      winston.info(`Server listening on port: ${this.port}`);
    });
  }
}
