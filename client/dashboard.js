Template.deviceList.devices = function() {
	return Devices.findUserDevices();
};
Template.deviceList.hasDevices = function() {
	return Devices.findUserDevices().count() > 0;
};
Template.deviceList.events({
	'click .addDevice': function(event, template) {
		$('#addDeviceModal').modal();
		analytics.event("Dashboard", "New device wizard");
	},
  "click a[name='gettingstarted']": function (event, template) {
    gotoPage('doc');
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
Template.device.name = function() {
	return "Name me!"
}
Template.device.lastSeen = function() {
	return moment(this.lastSeen).fromNow();
}
Template.device.logs = function() {
  return DeviceLogs.find({deviceId: this._id }, { sort: { ts: -1}, limit: 3 }).fetch().reverse();
}

var deviceLogsHandle;

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
  'click button.editCode': function(event, template) {
  	Session.set("editedDoc", template.data._id);
    gotoPage('editor');
  },
  'click button.viewLogs': function(event, template) {
    Session.set("logModalDevice", template.data);
    $('#logModal').modal();
    analytics.event("Dashboard", "View logs");
  },
  'click button.deleteLogs': function(event, template) {
    analytics.event("Dashboard", "Delete logs");
    Meteor.call('deleteDeviceLogs', template.data);
  }
});

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

Template.newDevice.events({
	'click .btn': function() {
	  analytics.event("Dashboard", "New device added");
		Devices.update({'_id': this._id}, {$set:{user: Meteor.userId()}});
		$('addDeviceModal').modal('hide');
	}
});

Template.logModal.deviceName = function() {
  var logModalDevice = Session.get("logModalDevice");
  if (logModalDevice)
    return logModalDevice.name;
  else
    return "";
}
Template.logModal.logs = function() {
  var logModalDevice = Session.get("logModalDevice");

  if (logModalDevice)
    return DeviceLogs.find({deviceId: logModalDevice._id});
  else
    return [];
}
Template.logLine.ts = function() {
  return moment(this.ts).format();
}
