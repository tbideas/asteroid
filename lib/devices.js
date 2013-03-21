Devices = new Meteor.Collection("devices");

/* Devices that have not been affected to a user yet */
Devices.findNewDevices = function() {
	return Devices.find({user: null});
};

Devices.findUserDevices = function(userId) {
	userId = (typeof userId === "undefined") ? Meteor.userId() : userId;
	return Devices.find({user: userId});
};
