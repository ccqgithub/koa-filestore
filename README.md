# koa-fileStore

> a FileStore use [flat-cache](https://github.com/royriojas/flat-cache) for [koa-session](https://github.com/koajs/session).

## requirement

- node.js@8.x (es6)
- koa@2.x

## use

```js
const Koa = require('koa');
const FileStore = require('koa-fileStore');
const session = require('koa-session');
const path = require('path');
const app = new Koa();

app.use(session({
  // other session config
  store: new FileStore({
    cacheId: 'a unique id for flat-cache to store', // Not required.
    cacheDir: path.resolve(__dirname, './session/'), // Dir to store session files, unencrypted.
    maxAge: 86400000, // Default maxAge for session, used if the maxAge of `koa-session` is undefined, avoid the session's key in cookies is stolen.
  })
}, app));
```
