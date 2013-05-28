Devices = new Meteor.Collection("devices");

/* Devices that have not been affected to a user yet - and that match the given ip! */
Devices.findNewDevices = function(ip) {
  return Devices.find({user: null, $or: [{ip: ip}, {ip: null}, {ip: "n/a"}]});
};

Devices.findUserDevices = function(userId) {
  userId = (typeof userId === "undefined") ? Meteor.userId() : userId;
  return Devices.find({user: userId});
};
