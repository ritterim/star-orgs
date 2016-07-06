/* eslint-disable */

window.crypto = {
  getRandomValues: function(typedArray) {
    for (let i = 0; i < typedArray.length; i++) {
      typedArray[i] =

      // http://stackoverflow.com/a/2117523
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
  }
};
