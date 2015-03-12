var request = require('request'),
  _ = require('lodash');

module.exports = Gnipper;

function Gnipper (options) {
  if (!options) throw new Error('No options supplied to Gnipper constructor');
  if (!options.account || !options.username || !options.password) {
    throw new Error('Missing required option. Required: account, username, password');
  }

  this.account = options.account;
  this.username = options.username;
  this.password = options.password;
  this.API = 'https://search.gnip.com/accounts/' + options.account;
}

Gnipper.prototype.searchUrl = function (options) {
  var label = options.label || 'prod';
  var url = this.API + '/search/' + label + '.json?';
  delete options.label;

  _.each(options, function (value, key) {
    url = url + key + '=' + encodeURIComponent(value) + '&';
  });

  // Drop the final & and return the URL
  return url.slice(0, -1);
};

Gnipper.prototype.search = function (options, callback) {
  if (!options.publisher) return callback(new Error('publisher is a required param for Gnipper.search()'));

  var that = this;
  var searchUrl = this.searchUrl(options);

  request
    .get(searchUrl, {
      'auth': {
        'user': that.username,
        'pass': that.password
      }
    }, function(err, res, body) {
      if (err) {
        // Include the error details returned by the Gnip API
        var err = _.merge(err, res.error, res.body.error);
        // Include Gnipper details with the error as well
        err.gnipper = {
          searchUrl: searchUrl,
          username: that.username,
          passwordIsDefined: (_.isUndefined(that.password)) ? false : true
        };
        return callback(err, res);
      } else {
        try {
          res.body = JSON.parse(body);
        } catch(e) {}
        callback(null, res)
      }
    });
};
