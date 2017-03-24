var config = require('../../config');
var candidates = require('../../candidates.js');

var pg = require('pg');
var async = require('async');
var OAuth = require('oauth');
var pool = new pg.Pool(config.db);
var user = process.argv[2];
var oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  config.twitter.twitterKey,
  config.twitter.twitterSecret,
  '1.0A',
  null,
  'HMAC-SHA1'
);

var url ='https://api.twitter.com/1.1/statuses/user_timeline.json?user_id='
+ user;
oauth.get(
  url,
  config.twitter.token,
  config.twitter.secret,
  function (error, data, response){
    if (error){
      var finalError = {};
      finalError.twitterError = error;
      finalError.url = url;
      console.error(finalError);
      return;
    }
    data = JSON.parse(data);
    //if profile photo is the default ignore this user

    if(data[0].user.default_profile_image){

      pool.connect(function(err, client, done) {
       if(err) {
         console.error('error fetching client from pool', err);
         callback(err);
       }

       client.query('UPDATE followers SET useful=FALSE WHERE follower_id=$1;',
        [user], function(err, result) {
         //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
         done(err);

         if(err) {
           console.error('error running query', err);

         }

         console.log(result);
         //output: 1
         process.exit(0);
       });
     });


    }
    //console.log(JSON.stringify(data, 0, 2));

    async.each(data,
       function(tweet, callback){
         pool.connect(function(err, client, done) {
          if(err) {
            console.error('error fetching client from pool', err);
            callback(err);
          }
          //INSERT INTO tweets VALUES ('4','2','2','{}',2,2,2,'{}','Tue Feb 07 20:22:42 +0000 2017');
          client.query('INSERT INTO tweets VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (tweet_id) DO UPDATE SET favorites_number = excluded.favorites_number, retweets_number = excluded.retweets_number, replies_number = excluded.replies_number;',
           [tweet.id_str, tweet.user.id_str, tweet.text, tweet.user_mentions, tweet.favorite_count,tweet.retweet_count,0,"{}",tweet.created_at], function(err, result) {
            //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
            done(err);

            if(err) {
              console.error('error running query', err);
              callback(err);
            }
            console.log(result);
            //output: 1
            callback();
          });
        });




       },
      function(err){
      // if any of the saves produced an error, err would equal that error
      pool.on('error', function (err, client) {
      // if an error is encountered by a client while it sits idle in the pool
      // the pool itself will emit an error event with both the error and
      // the client which emitted the original error
      // this is a rare occurrence but can happen if there is a network partition
      // between your application and the database, the database restarts, etc.
      // and so you might want to handle it and at least log it out
        console.error('idle client error', err.message, err.stack)
      });
      if(err){
        var error = {};
        error.twitterError = err;
        error.url = url;
        console.log(error);
      }
      process.exit(0);

    });

});
