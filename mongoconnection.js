

// var password = 'vnrIrIuYBnv0';
// var mongourl = "mongodb://eenciso:"+password+"@ds129090.mlab.com:29090/pointoc"
//
// var MongoClient = require('mongodb').MongoClient
//     , format = require('util').format;
// MongoClient.connect(mongourl, function (err, db) {
//     if (err) {
//         throw err;
//     } else {
//         console.log("successfully connected to the database");
//     }
//     db.close();
// });

// var pg = require('pg');
// var candidates = require('./candidates.js');
// var childProcess = require('child_process');
// var async = require('async');
var schedule = require('node-schedule');
// var cursorArray = [];
// cursorArray.push(-1);
// var apiCallsCount = 0;
//
// function runScript(scriptPath, argv, callback) {
//
//     // keep track of whether callback has been invoked to prevent multiple invocations
//     var invoked = false;
//
//     var process = childProcess.fork(scriptPath, argv);
//
//     // listen for errors as they may prevent the exit event from firing
//     process.on('error', function (err) {
//         if (invoked) return;
//         invoked = true;
//         callback(err);
//     });
//
//     // execute the callback once the process has finished running
//     process.on('exit', function (code) {
//         if (invoked) return;
//         invoked = true;
//         var err = code === 0 ? null : new Error('exit code ' + code);
//         callback(err);
//     });
//
//     process.on('message', function (msg){
//       console.log('message from child: ' + require('util').inspect(msg));
//       //save msg into mongodb
//       cursorArray.push(msg.cursor);
//       apiCallsCount = msg.apiCalls;
//     });
//
// }

/*
// Now we can run a script and invoke a callback when complete, e.g.
runScript('./hello.js', ['hello', 'goodbye'], function (err) {
    if (err) throw err;
    console.log('finished running some-script.js');
});
*/
/*
async.series([
    function(callback) {
        // do some stuff ...
        callback(null, 'one');
    },
    function(callback) {
        // do some more stuff ...
        callback(null, 'two');
    }
],
// optional callback
function(err, results) {
    // results is now equal to ['one', 'two']
});*/



/*
var count_candidates = 0;
async.during(
    function (callback) {
        return callback(null, count_candidates < candidates.length);
    },
    function (callback) {
        // run candidate stats
        //run this four times
        runScript('./candidate_stats.js', [ candidates[count_candidates++].user_id], function (err) {
          if (err) throw err;
          console.log('finished running candidate_stats.js');
          callback();
        });
    }
);
*/

// run tweets
//run this four times
// var count_tweets = 0;
// async.during(
//     function (callback) {
//         return callback(null, count_tweets < candidates.length);
//     },
//     function (callback) {
//         // run candidate stats
//         //run this four times
//         runScript('./tweets.js', [candidates[count_tweets++].user_id], function (err) {
//             if (err) throw err;
//             console.log('finished running tweets.js');
//             callback();
//         });
//     }
// );



// run followers -- save cursor and userid, shedule  same call every 15 min until cursor ==0
// run four times
// limit 15 from tweeter

// var count_followers = 0;
// async.during(
//     function (callbackFollowers) {
//         return callbackFollowers(null, count_followers < candidates.length);
//     },
//     function (callbackFollowers) {
//         // run candidate stats
//         //run this four times
//
//         async.during(
//
//           function (callbackSchedule) {
//             runScript('./followers.js', [ candidates[count_followers].user_id, cursorArray.pop(), apiCallsCount], function (err) {
//               if (err) throw err;
//               console.log('finished running internal followers.js');
//               console.log(cursorArray);
//               if(cursorArray[0] == 0){
//                 count_followers++;
//                 cursorArray.pop();
//                 cursorArray.push(-1);
//                 return callbackFollowers();
//               }
//               return callbackSchedule(null, cursorArray[0] != 0);
//             });
//           },
//           function (callbackSchedule) {
//             console.log('Callback function running wait 15 min');
//             schedule.scheduleJob('*/17 * * * *', function() {
//               console.log('starting again!, api counts = 0')
//               apiCallsCount=0;
//               runScript('./followers.js', [ candidates[count_followers].user_id, cursorArray.pop(), apiCallsCount], function (err) {
//                 if (err) t  hrow err;
//                 console.log('finished running followers.js');
//
//                 return callbackSchedule();
//               });
//             });
//           }
//
//         );
//
//
//
//     }
// );
//

/*

runScript('./followers.js', [ candidates[0].user_id], function (err) {
    if (err) throw err;
    console.log('finished running some-script.js');
});

// run tweets
//limit 900 from tweeter
runScript('./tweets.js', [ candidates[0].user_id], function (err) {
    if (err) throw err;
    console.log('finished running some-script.js');
    callback();
});
*/


schedule.scheduleJob('/1 * * * * *', function() {
//               console.log('starting again!, api counts = 0')
console.log('hola');
});
