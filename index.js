var config = require('./config');
var candidates = require('./candidates.js');

var pg = require('pg');
var async = require('async');
var OAuth = require('oauth');
var pool = new pg.Pool(config.db);

var oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  config.twitter.twitterKey,
  config.twitter.twitterSecret,
  '1.0A',
  null,
  'HMAC-SHA1'
);

oauth.get(
  'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='
  + candidates[0].screen_name,
  config.twitter.token,
  config.twitter.secret,
  function (error, data, response){
    if (error){
      console.error(error);
      return;
    }
    data = JSON.parse(data);
    console.log(JSON.stringify(data, 0, 2));

    async.each(data,
       function(tweet, callback){
         pool.connect(function(err, client, done) {
          if(err) {
            console.error('error fetching client from pool', err);
            callback(err);
          }
          //INSERT INTO tweets VALUES ('4','2','2','{}',2,2,2,'{}','Tue Feb 07 20:22:42 +0000 2017');
          client.query('INSERT INTO tweets VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO UPDATE SET column_1 = excluded.column_1, column_2 = excluded.column_2;',
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
      console.log(err);
    });

});
