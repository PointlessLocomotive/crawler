var async = require('async');
var path = require('path')
var utils = require('./run_script.js');
var candidates = require('../candidates.js');

var count_tweets = 0;
var config = require('../config');
var pg = require('pg');
var pool = new pg.Pool(config.db);


pool.connect(function(err, client, done) {



  if(err) {
    console.error('error fetching client from pool', err);
  }


  var rows = [];

  client.query('SELECT FOLLOWER_ID FROM FOLLOWERS;',
   [], function(err, result) {
    //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
    done(err);

    if(err) {
      console.error('error running query', err);

    }
    async.during(
      function(callback){
        console.log(count_tweets);
        utils.runScript('./main_scripts/db_helpers/tweets.js', [ result.rows[count_tweets].follower_id ], function (err){
          return callback(null, count_tweets < result.rows.length);
        });
      },
      function(callback){

        count_tweets++;
        console.log();
        if(count_tweets%899===0){
          var minutes = 15, waitingInterval = minutes * 60 * 1000;
          setInterval(function() {

            console.log("starting now, timenow: " + new Date().getSeconds());
            count_tweets = 0;

            return callback();

          }, waitingInterval);

        }else{
          return callback();
        }

      },
      function(err){
        console.log("finish with "+err);
      }

    );
  });
});


  // query.on('row', function(row) {
  //   //fired once for each row returned
  //   console.log(row);
  //   rows.push(row);
  // });
  // query.on('end', function(result) {
  //   console.log(result);
  // })
  // query.on('error', function(error) {
  //   console.log(error);
  // });

//});

// async.forEachOf(obj, function (value, key, callback) {
//
//
//
// }, function (err) {
//   if (err) console.error(err.message);
//   // configs is now a map of JSON data
//   doSomethingWith(configs);
// });
//
//
