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


var tmpCursors = [];
var user = process.argv[2];
var cursor = process.argv[3 ];
var apiCallsCount = process.argv[4];
var followersArray = [];
var apiPath = 'https://api.twitter.com/1.1/followers/ids.json?user_id=';
apiPath += user;/*user;*/
apiPath += '&cursor=';/* + cursor;*/

var currentFollowers = [];

async.during(
    function (callback) {
      var followersListFinish = cursor != 0;
      var haveCounts = apiCallsCount < 15;
        return callback(null, followersListFinish && haveCounts);
    },
    function (callback) {

      oauth.get(
        apiPath +  cursor,
        config.twitter.token,
        config.twitter.secret,
        function (error, followersData, response){
          if (error){
            console.error(error);
            callback(error);

          }
          followersData = JSON.parse(followersData);
          //console.log(JSON.stringify(followersData, 0, 2));

          followersArray = followersData.ids;
          cursor = followersData.next_cursor;
          apiCallsCount++;
          //console.log(cursor);
          tmpCursors.push(cursor);
          console.log(followersData.ids.length);
          currentFollowers=currentFollowers.concat(followersData.ids);

          callback();
    });
  },
    function (err) {
        if(err){
          console.log(err);
          return;
        }
        //console.log(followersArray);
        //console.log(tmpCursors);
        //console.log(followersArray.pop());
        //save current cursor and user
        console.log(currentFollowers.length);
        async.each(currentFollowers, function(follower, callback){


          var insertFollowers = 'INSERT INTO followers values($1, $2) ON CONFLICT DO NOTHING;';
          pool.connect(function(err, client, done) {
          if(err) {
            console.error('error fetching client from pool', err);
            callback(err);

          }
          client.query(insertFollowers, [candidates[0].user_id, follower], function(err, result) {
            //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
            done(err);

            if(err) {
              //return console.error('error running query', err);
              callback(err);
            }
            //console.log(result.rows[0].number);
            //output: 1
            callback();
          });
        });




        }, function(err){
          if(err){
            console.log('EEEEEEEEEEEEEERRRRRRRRRRRRRRRRROOOOOOOOOOOORRRRRRRRRRRR');
            console.log(err);
          }
          //save current cursor and user_id
          //return object with cursor and user id

          var importantInfo = {};
          importantInfo.user = user;
          importantInfo.cursor = cursor;
          importantInfo.apiCalls = apiCallsCount;
          console.log('done');
          console.log(importantInfo);
          process.send(importantInfo);
          process.exit(0);
        });
});
