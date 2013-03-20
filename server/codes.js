Meteor.startup(function() {
  Codes.allow({
  	insert: function(userId, doc){
  	  doc.userId = userId;
			return true;
		},
		'remove': function(userId, doc) {
      if (doc.userId == userId)
			  return true;
			else
			  return false;
		},
		'update': function(userId, code, fields, modifier) {
			/* Update userId of a device */
			if (fields.length == 1 && fields[0] == "code") {
        return true;
			}
			else
			  return false;
		}
	});
});

var rpiCode = function run() {
	//console.log("I do nothing. hey hey hye!");
	//return "nop";
	//var util = require("util");
	//var piblaster = require("pi-blaster.js");

	function setColor(red, green, blue) {
	  console.log(util.format("setColor: %d %d %d", red, green, blue));
	  piblaster.setPwm(1, red);
	  piblaster.setPwm(2, green);
	  piblaster.setPwm(4, blue);


	  // Enable the led if we have a value > 0
	  if (red > 0 || green > 0 || blue > 0) {
	    piblaster.setPwm(0, 1);
	  }
	  // Otherwise disable it
	  else {
      piblaster.setPwm(0, 0);
	  }
	}

	var SEC_PER_MIN = 10;
	setInterval(function() {
	  var d = new Date();
	  var intensity = 0;

	  if (d.getSeconds() > 60 - SEC_PER_MIN) {
	    intensity = 1 - (60 - d.getSeconds()) / SEC_PER_MIN;
	  }
	  switch (d.getMinutes() % 3) {
      case 0:
        setColor(intensity, 0, 0);
        break;
      case 1:
        setColor(0, intensity, 0);
        break;
      case 2:
        setColor(0, 0, intensity);
        break;
	  }
	}, 500);
}

Meteor.publish("user-codes", function() {
  return Codes.find({ 'userId': this.userId});
});
