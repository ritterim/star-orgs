// https://www.npmjs.com/package/polyfill-crypto.getrandomvalues
window.crypto = { getRandomValues: require('polyfill-crypto.getrandomvalues') };
