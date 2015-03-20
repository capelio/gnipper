var util = require('util');
var request = require('superagent');
var _ = require('lodash');

module.exports = Gnipper;

function Gnipper (options) {
  if (!options) throw new Error('No options supplied to Gnipper constructor');

  if (
    !options.account ||
    !options.username ||
    !options.password
  ) {
    throw new Error('Missing required option. Required: account, username, password');
  }

  this.options = options;
  this.API = 'https://search.gnip.com/accounts/' + options.account;
}

Gnipper.prototype.search = function (query, callback) {
  if (!query.publisher) return callback(new Error('publisher is a required param for Gnipper.search()'));

  var label = query.label || 'prod';
  var url = util.format('%s/search/%s.json', this.API, label);

  // TODO: Move the label option into the constructor
  if (query.label) delete query.label;

  var self = this;

  request
    .get(url)
    .query(query)
    .auth(this.options.username, this.options.password)
    .end(function (error, response) {
      if (error) {
        // Include the error details returned by the Gnip API
        var err = _.merge(error, response.body.error);

        // Include Gnipper details with the error as well
        err.gnipper = {
          url: url,
          username: self.options.username,
          passwordIsDefined: self.options.password ? false : true
        };

        return callback(err, response);
      }

      callback(null, response);
    });
};
