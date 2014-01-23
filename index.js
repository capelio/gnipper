var request = require('superagent'),
  _ = require('lodash');

module.exports = Gnipper;

function Gnipper (options) {
  if (!options) throw new Error('No options supplied to Gnipper constructor');

  this.options = options;
  this.API = 'https://search.gnip.com/accounts/' + options.account;
}

Gnipper.prototype.searchUrl = function (options) {
  var url = this.API + '/search/' + this.options.label + '.json?';

  _.each(options, function (value, key) {
    url = url + key + '=' + value + '&';
  });

  return url.slice(0, -1);
};

Gnipper.prototype.search = function (options, callback) {
  if (!options.publisher) return callback(new Error('publisher is a required param for Gnipper.search()'));

  request.get(this.searchUrl(options))
    .auth(this.options.username, this.options.password)
    .end(function (error, response) {
      if (error) return callback(error);
      callback(null, response);
  });
};
