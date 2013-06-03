Template.logModalTitle.deviceName = function() {
  var logModalDevice = Session.get("logModalDevice");
  if (logModalDevice)
    return logModalDevice.name;
  else
    return "";
}
Template.logModalContent.logs = function() {
  var logModalDevice = Session.get("logModalDevice");

  if (logModalDevice)
    return DeviceLogs.find({deviceId: logModalDevice._id});
  else
    return [];
}
Template.logLine.ts = function() {
  return moment(this.ts).format();
}
