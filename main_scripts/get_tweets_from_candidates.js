var async = require('async');
var path = require('path')
var utils = require('./run_script.js');
var candidates = require('../candidates.js');

module.exports = function (endCallback) {

  var count_tweets = 0;
  async.during(
      function (callback) {
        if(count_tweets >= candidates.length){
          endCallback();
        }
          return callback(null, count_tweets < candidates.length);
      },
      function (callback) {
        // run candidate stats
        //run this four times
        utils.runScript('./main_scripts/db_helpers/tweets.js',
        [candidates[count_tweets++].user_id], function (err) {
            if (err) throw err;
            console.log('finished running tweets.js');
            callback();
        });
      }
  );

}
