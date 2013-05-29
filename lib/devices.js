Devices = new Meteor.Collection("devices");

/* Devices that have not been affected to a user yet - and that match the given ip! */
Devices.findNewDevices = function(ip) {
  if (ip) {
    // On the server - we filter by ip address
    return Devices.find({user: null, $or: [{ip: ip}, {ip: null}, {ip: "n/a"}]});    
  }
  else {
    // On client - we just display what we have
    return Devices.find({user: null });
  }
};

Devices.findUserDevices = function(userId) {
  userId = (typeof userId === "undefined") ? Meteor.userId() : userId;
  return Devices.find({user: userId});
};
