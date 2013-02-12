Meteor.startup(function(){
	Devices.allow({
  	insert: function(userId, doc){
			return true;
		},
		'remove': function(userId, doc) { // TODO: dev only! removeme!
			return true;
		},
		'update': function(userId, docs, fields, modifier) {
			if (docs.length > 1) return false;

			/* Update userId of a device */
			if (fields.length == 1 && fields[0] == "user") {
				if (docs[0].user === undefined)
					return true;
				// TODO: Should also check that the IP addresses match
				// TODO: Should check that the user is setting his own id and not someone else's
			}
			/* Update the name of a device */
			if (fields.length == 1 && fields[0] == "name") {
				if (docs[0].user === Meteor.userId()) {
					return true;
				}
			}
			
			console.log("Devices.update() denied");
			console.log(docs);
			console.log(fields);
			console.log(modifier);
				
			return false;
		}
	});
});

Meteor.publish("new-devices", function() {
	return Devices.findNewDevices();
});
	
Meteor.publish("user-devices", function() {
	return Devices.findUserDevices(this.userId);
});

Meteor.methods({
	/* Each device is supposed to have a unique token and use it when connecting. */
	// TODO: add some security here ;) It is a little too easy to be someone's else device
	'register': function(token, software, version) {
		if (token === undefined) 
			return false;
		var d = Devices.find({'token': token});
		if (d.count() == 0) {
			var device = {
				'token': token,
				'software': software,
				'version': version,
				'ip': 'n/a',
				'lastSeen': new Date()
			};
			console.log("register(): new device - %j", device);
			// Looks like this is a new device. Let's create a line in database.
			Devices.insert(device);
		}
		else {
			var device = d.fetch()[0];
			Devices.update({_id: device._id}, { $set: { 'lastSeen': new Date() }});
			console.log("register() from known device - %j", device);
		}
		return true;
	}
});