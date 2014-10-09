Template.deviceList.devices = function() {
  return Devices.findUserDevices();
};
Template.deviceList.hasDevices = function() {
  return Devices.findUserDevices().count() > 0;
};
Template.sidebar.hasDevices = Template.deviceList.hasDevices;

Template.deviceList.events({
  'click .addDevice': function(event, template) {
    $('#addDeviceModal').modal();
    analytics.event("Dashboard", "New device wizard");
    Meteor.subscribe("new-devices");
  }
});
Template.device.rowClass = function(status) {
  switch (status) {
    case 'connected':
      return "";
    case 'disconnected':
      return "error";
    default:
      return "";
  }
};
Template.device.editName = function() {
  return this.name === undefined || Session.get("edit-" + this._id);
}
Template.device.displayName = function() {
  if (this.name === undefined) {
    return "Name me!";
  }
  else {
    return this.name;
  }
}
Template.device.lastSeen = function() {
  return moment(this.lastSeen).fromNow();
}
Template.device.logs = function() {
  return DeviceLogs.tailLogs(this._id, 3);
}

Template.device.events({
  'click td.deviceName': function (evt, template) {
    Session.set("edit-" + this._id, true);
  },
  'keypress input.endsInput, click button.endsInput': function (event, template) {
    if (event.type == 'click' || event.which === 13) {
      var name = template.find("input").value;
      Devices.update({_id: template.data._id}, {$set: { 'name': name }});
      Session.set("edit-" + this._id, false);
      event.stopImmediatePropagation();
    }
  },
  'click button.viewLogs': function(event, template) {
    Session.set("logModalDevice", template.data);
    $('#logModal').modal();
    analytics.event("Dashboard", "View logs");
  },
  'click button.deleteLogs': function(event, template) {
    analytics.event("Dashboard", "Delete logs");
    Meteor.call('deleteDeviceLogs', template.data._id);
  }
});



Template.newDevice.events({
  'click .btn': function() {
    analytics.event("Dashboard", "New device added");
    Devices.update({'_id': this._id}, {$set:{user: Meteor.userId()}});
    // We need to re-subscribe to logs - otherwise the logs of this new device
    // are not included in the subscription
    Meteor.subscribe("devicelogs");

    $('addDeviceModal').modal('hide');
  }
});

