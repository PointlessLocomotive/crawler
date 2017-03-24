var async = require('async');
var path = require('path')
var utils = require('./run_script.js');
var candidates = require('../candidates.js');
var count_candidates = 0;

module.exports = function(endCallback){
  console.log('running get_candidates.js');
  async.during(
      function (callback) {
        if(count_candidates>= candidates.length){
          endCallback();
        }
          return callback(null, count_candidates < candidates.length);
      },
      function (callback) {
          // run candidate stats
          //run this four times
          utils.runScript(path.resolve('./main_scripts/db_helpers/candidate_stats.js'),
          [ candidates[count_candidates++].user_id], function (err) {
            if (err) throw err;
            console.log('finished running candidate_stats.js');
            callback();

          });
      }
  );
}
