/*
* this program will call all the necesary scripts to get the info needed from twitter
*/
var async = require('async');
var getCandidates = require('./main_scripts/get_candidates.js');
var getTweetsFromCandidates  = require('./main_scripts/get_tweets_from_candidates.js');
var getFollowersFromCandidates = require('./main_scripts/get_followers_from_candidates.js');


async.series([
    function(callback) {
        console.log('getting candidates...')
        getCandidates(function(){
          console.log('all candidates info is saved!')
          callback(null, 'candidates info saved');
        });
    },
    function(callback) {
      getFollowersFromCandidates(function(){
        console.log('all followers saved');
        callback(null, 'followers from candidates saved');
      });
    },
    function(callback){
      getTweetsFromCandidates(function(){
        
        callback(null, 'tweets from candidates saved no implemented')
      });
    }
],
// optional callback
function(err, results) {

    console.log(results);
    process.exit(0);
});
