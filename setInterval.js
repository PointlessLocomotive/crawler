var minutes = 1, the_interval = minutes * 5 * 1000;
setInterval(function() {
  console.log("I am doing my 5 minutes check, timenow: " + new Date().getSeconds());
  // do your stuff here
}, the_interval);
