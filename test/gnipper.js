var test = require('tape'),
  nock = require('nock'),
  Gnipper = require('../');

var apiConfig = {
  account: 'ACME',
  username: 'wilycoyote',
  password: 'supersecret',
  label: 'prod'
};

var API = 'https://search.gnip.com';
var ACCOUNT = '/accounts/' + apiConfig.account;

var interceptTwitterSearchWithDefaults = nock(API)
  .get(ACCOUNT + '/search/prod.json?publisher=twitter&query=gnip')
  .reply(200);

var interceptTwitterSearchWithConfig = nock(API)
  .get(ACCOUNT + '/search/prod.json?publisher=twitter&query=gnip&fromDate=20130101000001&toDate=20130201115959&maxResults=50')
  .reply(200);

test('Gnipper', function(t) {
  t.plan(2);

  t.test('without constructor options', function(tt) {
    tt.plan(1);

    tt.throws(function () { var g = new Gnipper(); }, 'throws an exception');
  });

  t.test('without required options', function(tt) {
    tt.plan(1);

    tt.throws(function () { var g = new Gnipper({foo: 'bar'}); }, 'throws an exception');
  });
});

test('Gnipper.search', function (t) {
  t.plan(3);

  var gnip = new Gnipper(apiConfig);

  t.test('without options', function(tt) {
    tt.plan(1);

    gnip.search({}, function(error, response) {
      tt.ok(error instanceof Error, 'returns an error');
    });
  });

  t.test('with required options', function (tt) {
    tt.plan(1);

    gnip.search({
      publisher: 'twitter',
      query: 'gnip'
    }, function(error, response) {
      tt.equal(response.statusCode, 200, 'returns 200');
    });
  });

  t.test('with all options', function(tt) {
    tt.plan(1);

    gnip.search({
      publisher: 'twitter',
      query: 'gnip',
      fromDate: '20130101000001',
      toDate: '20130201115959',
      maxResults: 50
    }, function(error, response) {
      tt.equal(response.statusCode, 200, 'returns 200');
    });
  });
});
