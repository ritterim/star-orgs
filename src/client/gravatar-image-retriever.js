import md5 from 'md5';

export default class GravatarImageRetriever {
  constructor(picturePxSize) {
    this.picturePxSize = picturePxSize;
  }

  getImageUrl(email) {
    // https://en.gravatar.com/site/implement/hash/
    if (email) {
      // https://en.gravatar.com/site/implement/images/
      // https://github.com/blueimp/JavaScript-MD5
      return `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}.jpg`
        + `?s=${this.picturePxSize}&r=g&d=mm`;
    }
  }
}
