
var childProcess = require('child_process');
module.exports = {

  runScript: function (scriptPath, argv, callback) {

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
          var err = code === 0 ? null : new Error('exit code ' + code);
          callback(err);
      });

      process.on('message', function (msg){
        console.log('message from child: ' + require('util').inspect(msg));
        //save msg into mongodb
        cursorArray.push(msg.cursor);
        apiCallsCount = msg.apiCalls;
      });

  }
};//end of module.exports
