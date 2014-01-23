var request = require('superagent'),
  _ = require('lodash');

module.exports = Gnipper;

function Gnipper (options) {
  if (!options) throw new Error('No options supplied to Gnipper constructor');

  this.API_ROOT = 'https://' + options.username + ':' + options.password +
    '@search.gnip.com/accounts/' + options.account;
  this.SEARCH_ROOT = this.API_ROOT + '/search';
  this.options = options;
}

Gnipper.prototype.searchUrl = function (options) {
  var url = this.SEARCH_ROOT +
    '/' + this.options.label + '.json?';

  _.each(options, function (value, key) {
    url = url + key + '=' + value + '&';
  });

  return url.slice(0, -1);
};

Gnipper.prototype.search = function (options, callback) {
  if (!options.publisher) return callback(new Error('publisher is a required param for Gnipper.search()'));

  request.get(this.searchUrl(options), function (error, response) {
    if (error) return callback(error);
    callback(null, response);
  });
};
