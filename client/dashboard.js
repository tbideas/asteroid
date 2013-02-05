Template.deviceList.events({
	'click .btn': function(event, template) {
		Session.set("devices", [
			{name: "Boris Loochi", status: "connected", message: "Running: iss.js"},
			{name: "Thomas Raspberry Pi", status: "disconnected", message: "Device not connected"},
			{name: "Weather Station Dakar", status: "connected", message: "Running: weather.js"}
		]);
	}
});

Template.deviceList.devices = function() {
	return Session.get("devices");
};

Template.deviceList.hasDevices = function() {
	return Session.get("devices") != null && Session.get("devices").length > 0;
}

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