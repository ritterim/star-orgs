import Cache from 'cache-storage';
import FileStorage from 'cache-storage/Storage/FileSyncStorage';
import MemoryStorage from 'cache-storage/Storage/MemorySyncStorage';

// Wraps an image retriever with caching
export default class CachingImageRetriever {
  // eslint-disable-next-line no-magic-numbers
  constructor(imageRetriever, storageType = 'file', cacheDurationDays = 7) {
    if (!imageRetriever) {
      throw new Error('imageRetriever must be specified.');
    }

    if (storageType !== 'file' && storageType !== 'memory') {
      throw new Error('file or memory must be specified.');
    }

    this.imageRetriever = imageRetriever;
    this.storageType = storageType;
    this.cacheDurationDays = cacheDurationDays;

    const storage = storageType === 'file'
      ? new FileStorage('./dist/cache')
      : new MemoryStorage();

    this.cache = new Cache(storage, 'graph-images');
  }

  getImage(email) {
    if (!email) {
      return Promise.resolve(null);
    }

    const cachedImage = this.cache.load(email);

    if (cachedImage !== null) {
      return Promise.resolve(cachedImage);
    }

    return this.imageRetriever
      .getImage(email)
      .then(image => {
        this.cache.save(email, image, {
          expire: { days: this.cacheDurationDays }
        });

        return image;
      });
  }

  clear() {
    this.cache.clean(Cache.ALL);
  }
}
