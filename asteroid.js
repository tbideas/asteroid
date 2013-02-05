if (Meteor.isClient) {
	Meteor.startup(function() {
		Session.set("clicks", 0);
	});
	
  Template.hello.greeting = function () {
    return "Welcome to asteroid!";
  };

	Template.hello.clicks = function() {
		if (Session.get("clicks") == 0) { 
			return "You should really click on that button! ";
		}
		else {
			return "You have clicked: " + Session.get("clicks") + " times.";
		}
	};

	Template.connectionStatus.status = function() {
		return "Connection status: " + Meteor.status().status;
	};

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button - clicks=" + Session.get("clicks"));
			Session.set("clicks", Session.get("clicks")+1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
