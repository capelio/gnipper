# Gnipper

Node.JS Gnip client

# Example

``` js
var Gnipper = require('gnipper');

var gnip = new Gnipper({
  account: 'Account',
  username: 'Username',
  password: 'Password'
});

gnip.search({
  publisher: 'twitter',
  query: 'gnip has:media',
  fromDate: YYYYMMDDhhmm,    // optional
  toDate: YYYYMMDDhhmm,      // optional
  maxResults: 10..500,       // optional
  label: 'prod'              // optional, defaults to prod
}, function(error, data) {
  if (error) {
    ...
  }
  return data;
});
```

# Installation

```
npm install gnipper
```

# Roadmap

1.x

- [ ] Query validation (per-publisher operator whitelist, etc)
- [ ] gnip.estimate()

2.x

- [ ] Convert to streams for { allPages: true } search option
- [ ] gnip.stream()

# License

MIT
