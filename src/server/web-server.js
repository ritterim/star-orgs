/* eslint-disable no-magic-numbers */

import express from 'express';
import compression from 'compression';
import winston from 'winston';

export default class WebServer {
  constructor(directoryItems, imageRetriever, refreshFunction, clearImagesFunction, logoUrl) {
    const defaultPort = 8081;

    this.directoryItems = directoryItems;
    this.imageRetriever = imageRetriever;
    this.refreshFunction = refreshFunction;
    this.clearImagesFunction = clearImagesFunction;
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

    app.get('/image', (req, res) => {
      this.imageRetriever.getImage(req.query.email)
        .then(img => {
          if (img) {
            res.set({
              'Content-Type': 'image/jpeg', // TODO: Use an appropriate content type to match the image
              'Content-Length': img.length
            });
            res.end(img, 'binary');
          } else {
            res.sendStatus(404);
          }
        })
        .catch(err => {
          winston.warn(err.message);
          res.sendStatus(500);
        });
    });

    app.get('/refresh', (req, res) => {
      this.refreshFunction()
        .catch(err => {
          winston.error(err);
        });

      res.send('Refresh request received. <a href="/">Return to organizational chart</a>');
    });

    app.get('/clear-images', (req, res) => {
      this.clearImagesFunction()
        .catch(err => {
          winston.error(err);
        });

      res.send('Clear images request received. <a href="/">Return to organizational chart</a>');
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
