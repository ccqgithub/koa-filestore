const flatCache = require('flat-cache');
const uuidv4 = require('uuid/v4');

module.exports = class FileStore {
  constructor(opts={}) {
    this.cacheDir = opts.cacheDir;
    this.maxAge = opts.maxAge || 86400000; //ms, 1 day
  }

  get(key, maxAge, { rolling }) {
    let cache = flatCache.load(key, this.cacheDir);
    let data = cache.getKey(key);
    // no session
    if (!data || !data.session) return null;
    // session expired
    if (data.expired < Date.now() + (maxAge || 0)) return null;
    // session
    return data.session;
  }

  set(key, sess, maxAge, { rolling, changed }) {
    let cache = flatCache.load(key, this.cacheDir);
    let data = {};

    data.session = sess;
    data.expired = Date.now() + (maxAge || this.maxAge);
    cache.setKey(key, data);
    cache.save();
  }

  destroy(key) {
    flatCache.clearCacheById(key);
  }
}
