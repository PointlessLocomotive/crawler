var config = require('../../config');
var candidates = require('../../candidates.js');

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
  'https://api.twitter.com/1.1/users/show.json?user_id='
  + process.argv[2],
  config.twitter.token,
  config.twitter.secret,
  function (error, candidateInfo, response){
    if (error){
      console.error(error);
      return;
    }
    candidateInfo = JSON.parse(candidateInfo);
    //console.log(JSON.stringify(candidateInfo, 0, 2));


         pool.connect(function(err, client, done) {
          if(err) {
            console.error('error fetching client from pool', err);

          }

          var multipleInsert =
          'with new_order as (\
            insert into candidates values ($1, $2, $3, $4, $5)\
           ON CONFLICT (candidate_id) DO UPDATE set\
            candidate_id=excluded.candidate_id\
            returning candidate_id\
            )\
              insert into candidate_stats (candidate_id, follower_number) \
              values ( (select candidate_id from new_order),\
            $6);'

          client.query(multipleInsert,
            [candidateInfo.id_str,
            candidateInfo.screen_name,
            candidates[0].political_party,
            candidateInfo.profile_image_url_https,
            candidates[0].political_orientantion,
            candidateInfo.followers_count ], function(err, result) {
            //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
            done(err);

            if(err) {
              console.error('error running query', err);

            }
            console.log(result);
            process.exit(0);

        });
      });
      // if any of the saves produced an error, err would equal that error
      pool.on('error', function (err, client) {
      // if an error is encountered by a client while it sits idle in the pool
      // the pool itself will emit an error event with both the error and
      // the client which emitted the original error
      // this is a rare occurrence but can happen if there is a network partition
      // between your application and the database, the database restarts, etc.
      // and so you might want to handle it and at least log it out
        console.error('idle client error', err.message, err.stack)
        process.exit(1);



    });

});
