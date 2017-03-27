var async = require('async');
var path = require('path');
var moment = require('moment');
var childProcess = require('child_process');
var utils = require('./run_script.js');
var candidates = require('../candidates.js');
var count_followers = 0;
var cursorArray = [];
cursorArray.push(-1);
var apiCallsCount = 0;


function runScript(scriptPath, argv, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath, argv);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null :null;
        callback(err);
    });

    process.on('message', function (msg){
      console.log('message from child: ' + require('util').inspect(msg));
      //save msg into mongodb
      cursorArray.push(msg.cursor);
      apiCallsCount = msg.apiCalls;
    });

}



module.exports = function(endCallback){

  async.during(
      function (callbackFollowers) {
          return callbackFollowers(null, count_followers < candidates.length);
      },
      function (callbackFollowers) {
          // run candidate stats
          //run this four times
          async.during(

            function (callbackSchedule) {
              console.log('candidate: '+(count_followers+1) + ' out of '+ candidates.length);
              runScript('./main_scripts/db_helpers/followers.js', [ candidates[count_followers].user_id, cursorArray.pop(), apiCallsCount], function (err) {
                if (err) throw err;
                console.log('finished running internal followers.js');
                console.log('cursor:')
                console.log(cursorArray);
                if(cursorArray[0] == 0){
                  count_followers++;
                  cursorArray.pop();
                  cursorArray.push(-1);
                  if(count_followers === candidates.length){
                    endCallback();
                  }
                  return callbackFollowers();
                }
                return callbackSchedule(null, cursorArray[0] != 0);
              });
            },
            function (callbackSchedule) {
              console.log('candidate: '+(count_followers+1) + ' out of '+ candidates.length);
              console.log('finished at: '+ moment().format('MMMM Do YYYY, h:mm:ss a'));
              console.log('starting in 15min');
              console.log('will start at: '+ moment().add(15,'m').format('MMMM Do YYYY, h:mm:ss a'));

              var minutes = 17, waitingInterval = minutes * 60 * 1000;
              setInterval(function() {
                console.log("starting now, timenow: " + moment().format('MMMM Do YYYY, h:mm:ss a'));
                apiCallsCount = 0;
                return callbackSchedule();
              }, waitingInterval);
            }

          );
      }
  );

}
