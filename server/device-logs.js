Meteor.methods({
  'deleteDeviceLogs': function(aDeviceId) {
    var userId = (typeof userId === "undefined") ? Meteor.userId() : userId;

    // First let's make sure that the device actually belongs to the user.
    var device = Devices.findOne({ _id: aDeviceId });
    if (device.user != userId) {
      console.warn("User trying to delete logs of a device he does not own! User: %s Device: %j", userId, device);
      return false;
    }

    DeviceLogs.remove({deviceId: device._id});
    return true;
  },
  'writeConsole': function(token, level, msg) {
    if (token === undefined)
      return false;
    var d = Devices.find({'token': token});
    if (d.count() > 0) {
      var device = d.fetch()[0];

      DeviceLogs.insert({
        deviceId: device._id,
        ts: new Date(),
        level: level,
        message: msg
      });
    }
  }
});

Meteor.publish("devicelogs", function() {
  var userDevices = Devices.find({ user: this.userId }, { _id: 1}).fetch();
  var devicesId = _.pluck(userDevices, '_id');
  console.log("DeviceLogs, subscribing user: %s to devices: %j", this.userId, devicesId);
  return DeviceLogs.find({deviceId: { '$in': devicesId} }, { sort: { ts: -1}, limit: 100 } );
});
