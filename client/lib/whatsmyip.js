WhatsMyIp = {};

WhatsMyIp.getIP = function(cb) {
  Meteor.http.get("http://io.tbideas.com/ip/", function(error, result) {
    if (!error) {
      cb(result.content);
    }
    else {
      cb(undefined);
      console.log("Unable to find our IP address: %s", error);
    }
  })
}