import md5 from 'md5';

export default class GravatarImageRetriever {
  constructor(picturePxSize) {
    if (!picturePxSize) {
      throw new Error('picturePxSize must be provided.');
    }

    this.picturePxSize = picturePxSize;
  }

  getImageUrl(email) {
    // https://en.gravatar.com/site/implement/hash/
    if (email) {
      // https://en.gravatar.com/site/implement/images/
      return `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}.jpg`
        + `?s=${this.picturePxSize}&r=g&d=mm`;
    }

    return null;
  }
}
