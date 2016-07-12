/* eslint-disable no-magic-numbers */

import test from 'ava';
import request from 'supertest';
import winston from 'winston';

import WebServer from '../../src/server/web-server';

process.env.port = 0;

test.before(() => {
  winston.level = 'error';
});

test.serial('/directory should return directoryItems', () => {
  const webServer = new WebServer([{ name: 'item-1' }]);

  webServer.start();

  return request(webServer.app)
    .get('/directory')
    .expect(200, [{ name: 'item-1' }]);
});

test.serial('/refresh should return HTTP 200', () => {
  const webServer = new WebServer(null, () => Promise.resolve(true));

  webServer.start();

  return request(webServer.app)
    .get('/refresh')
    .expect(200);
});

test.serial('/refresh should invoke refreshFunction', () => {
  let invokedCount = 0;
  const refreshFunction = function () {
    invokedCount++;
    return Promise.resolve(true);
  };
  const webServer = new WebServer(null, refreshFunction);

  webServer.start();

  return request(webServer.app)
    .get('/refresh')
    .expect(() => {
      if (invokedCount !== 1) {
        throw new Error(`invokedCount: ${invokedCount} is expected to be 1.`);
      }
    });
});

test.serial('/logo should use default logo', () => {
  const webServer = new WebServer();

  webServer.start();

  return request(webServer.app)
    .get('/logo')
    .expect(302)
    .expect('Location', 'logo.png');
});

test.serial('/logo should redirect to custom logo', () => {
  const customLogoUrl = 'https://example.com/custom-logo.png';

  const webServer = new WebServer(null, null, customLogoUrl);

  webServer.start();

  return request(webServer.app)
    .get('/logo')
    .expect(302)
    .expect('Location', customLogoUrl);
});
