# koa-filestore

> a FileStore use [flat-cache](https://github.com/royriojas/flat-cache) for [koa-session](https://github.com/koajs/session).

## Suggested to use for:

- The amount of your site's users is not very large.
- Has sensitive session contents that can not store in cookie (e.g. some tokens).

## Not suggested to use for:

- The amount of your site's users is very large(you need use other stores like `koa-redis`...).
- No sensitive session contents that can not store in cookie.

## requirement

- node.js@8.x (es6)
- koa@2.x

## use

```js
const Koa = require('koa');
const FileStore = require('koa-filestore');
const session = require('koa-session');
const path = require('path');
const app = new Koa();

app.use(session(app, {
  // other session config
  store: new FileStore({
    cacheDir: path.resolve(__dirname, './session/'), // Dir to store session files, unencrypted.
    maxAge: 86400000, // Default maxAge for session, used if the maxAge of `koa-session` is undefined, avoid the session's key in cookies is stolen.
  })
}));
```

## Tips

Every `session key` will generate a file in the `cacheDir`, so maybe you will clean the old files after some days.

You can make a `timed task` of `shell script` to clean them (e.g. delete files that last update is before 30 days).

some example, for reference only:

/root/soft_shell/clean-cache.sh:

```sh
#!/bin/sh
find /app/cacheDir/ -mtime +30 -name "*.*" -exec rm -Rf {} \;
```

crontab:

```sh
crontab -l
10 4 1 * * /bin/sh /root/soft_shell/clean-cache.sh
```

