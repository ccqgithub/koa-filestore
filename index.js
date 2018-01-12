const flatCache = require('flat-cache');

module.exports = class FileStore {
  constructor(opts={}) {
    if (!opts.cacheDir) {
      throw new Error('no cacheDir');
    }

    this.cacheDir = opts.cacheDir;
    this.maxAge = opts.maxAge || 86400000; //ms, 1 day
  }

  async get(key, maxAge, { rolling }) {
    let cache = flatCache.load(key, this.cacheDir);
    let session = cache.getKey('session') || null;
    let expired = cache.getKey('expired') || null;

    // expired
    if (expired && expired < Date.now()) {
      return null;
    }

    // no session
    if (!session) return null;

    // reset expired
    if (rolling) {
      cache.setKey('expired', Date.now() + (maxAge || this.maxAge));
      cache.save();
    }
    
    // this session
    return session;
  }

  async set(key, sess, maxAge, { rolling, changed }) {
    let cache = flatCache.load(key, this.cacheDir);
    let expired = cache.getKey('expired') || null;

    // no change
    if (expired && !rolling && !changed) return;

    // reset expired
    if (!expired || rolling) {
      cache.setKey('expired', Date.now() + (maxAge || this.maxAge));
    }

    // set session
    cache.setKey('session', sess);

    // save to file
    cache.save();
  }

  async destroy(key) {
    flatCache.clearCacheById(key);
  }
}
