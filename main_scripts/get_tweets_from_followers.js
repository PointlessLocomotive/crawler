var async = require('async');
var path = require('path')
var utils = require('./run_script.js');
var candidates = require('../candidates.js');

var count_tweets = 0;
var config = require('../config');
var pg = require('pg');
var client = new pg.Client();

module.exports = function (endCallback) {

  var query = client.query('SELECT FOLLOWER_ID FROM FOLLOWERS');
  query.on('row', function(row) {
    utils.runScript('./main_scripts/db_helpers/tweets.js', [ row.Follower_ID, count_tweets++],
    function (err) {
        if (err) throw err;
        console.log('finished running tweets.js');
    });
  });

}
