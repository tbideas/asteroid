DeviceLogs = new Meteor.Collection("devicelogs");

DeviceLogs.tailLogs = function(deviceId, n) {
  return DeviceLogs.find({deviceId: deviceId }, { sort: { ts: -1}, limit: n }).fetch().reverse();
}
