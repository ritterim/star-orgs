import md5 from 'md5';
import rp from 'request-promise';

export default class GravatarImageRetriever {
  getImage(email) {
    if (!email) {
      return Promise.resolve(null);
    }

    const picturePxSize = 150;

    return rp({
      method: 'GET',
      encoding: null,

      // https://en.gravatar.com/site/implement/hash/
      // https://en.gravatar.com/site/implement/images/
      uri: `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}.jpg`
        + `?s=${picturePxSize}&r=g&d=404`
    });
  }
}
