const flatCache = require('flat-cache');
const uuidv4 = require('uuid/v4');

module.exports = class FileStore {
  constructor(opts={}) {
    this.cacheId = opts.cacheId || uuidv4();
    this.cacheDir = opts.cacheDir;
    this.maxAge = opts.maxAge || 86400000; //, 1 day
    // cache
    this.cache = flatCache.load(this.cacheId, this.cacheDir);
  }

  get(key, maxAge, { rolling }) {
    let data = this.cache.getKey(key);
    // no session
    if (!data || !data.session) return null;
    // session expired
    if (data.expired < Date.now() + (maxAge || 0)) return null;
    // session
    return data.session;
  }

  set(key, sess, maxAge, { rolling, changed }) {
    let data = {};

    data.session = sess;
    data.expired = Date.now() + (maxAge || this.maxAge);
    this.cache.setKey(key, data);
    this.cache.save();
  }

  destroy(key) {
    this.cache.removeKey('key');
  }
}
