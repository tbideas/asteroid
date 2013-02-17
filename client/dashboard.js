Template.dashboard.rendered = function() { analytics.page('/dashboard'); }

Template.deviceList.devices = function() {
	return Devices.findUserDevices();
};
Template.deviceList.hasDevices = function() {
	return Devices.findUserDevices().count() > 0;
};
Template.deviceList.events({
	'click .btn': function(event, template) {
		$('#addDeviceModal').modal();
		analytics.event("Dashboard", "New device wizard");
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
Template.device.events({
	'click td.deviceName': function (evt, template) {
		Session.set("edit-" + this._id, true);
	},
 	'keypress input, click button': function (event, template) {
    if (event.type == 'click' || event.which === 13) {
      var name = template.find("input").value;
			Devices.update({_id: template.data._id}, {$set: { 'name': name }});
			Session.set("edit-" + this._id, false);
			event.stopImmediatePropagation();
    }
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