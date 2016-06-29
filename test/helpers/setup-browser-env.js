// https://github.com/avajs/ava/blob/4d3ed27865dc7cdfde7e651711ee4cd0646ea6e8/docs/recipes/browser-testing.md

global.document = require('jsdom').jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;
