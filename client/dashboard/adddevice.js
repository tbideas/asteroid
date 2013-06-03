Template.addDeviceModal.events({
  'click .btn': function(event, template) {
    $('#addDeviceModal').modal("hide");
  }
});

Template.addDeviceModalBody.devices = function() {
  return Devices.findNewDevices();
};
Template.addDeviceModalBody.hasDevices = function() {
  return Devices.findNewDevices().count() > 0;
};