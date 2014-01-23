var request = require('superagent'),
  _ = require('lodash');

module.exports = Gnipper;

function Gnipper (options) {
  if (!options) throw new Error('No options supplied to Gnipper constructor');
  if (!options.account || !options.username || !options.password || !options.label) {
    throw new Error('Missing required option. Required: account, username, password, label');
  }

  this.account = options.account;
  this.username = options.username;
  this.password = options.password;
  this.label = options.label;
  this.API = 'https://search.gnip.com/accounts/' + options.account;
}

Gnipper.prototype.searchUrl = function (options) {
  var url = this.API + '/search/' + this.label + '.json?';

  _.each(options, function (value, key) {
    url = url + key + '=' + value + '&';
  });

  return url.slice(0, -1);
};

Gnipper.prototype.search = function (options, callback) {
  if (!options.publisher) return callback(new Error('publisher is a required param for Gnipper.search()'));

  request.get(this.searchUrl(options))
    .auth(this.username, this.password)
    .end(function (error, response) {
      if (error) return callback(error);
      callback(null, response);
  });
};
