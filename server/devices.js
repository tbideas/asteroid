Meteor.startup(function(){
  Devices.deny({
    'update': function(userId, device, fields, modifier) {
      if (_.contains(fields, 'user')) {
        var registerDevice = Meteor.settings.emails && Meteor.settings.emails.registerDevice;

        if (registerDevice) {
          var content = 'Hi there!\n\n'
            + 'A new device has been registed by user ' + getUserDisplayName(Meteor.user()) + '.\n\n'
            + 'The new device is :\n' + JSON.stringify(device) + '\n\n'
            + 'Have a nice day!\n'
            + 'pijs.io';
          Email.send({
            to: registerDevice,
            from: Meteor.settings.emails.from,
            subject: '[pijs.io] New device registered by ' + getUserDisplayName(Meteor.user()),
            text: content
          });
        }
      }
      return false;
    }
  }),
  Devices.allow({
    'update': function(userId, device, fields, modifier) {
      /* Update userId of a device */
      if (fields.length == 1 && fields[0] == "user") {
        if (device.user === undefined || device.user === null)
          return true;
        // TODO: Should also check that the IP addresses match
        // TODO: Should check that the user is setting his own id and not someone else's
      }
      /* Update the name of a device */
      if (fields.length == 1 && fields[0] == "name") {
        if (device.user === Meteor.userId()) {
          return true;
        }
      }
      /* Update the code of a device */
      if (fields.length == 1 && fields[0] == "code") {
        if (device.user === Meteor.userId()) {
          return true;
        }
      }

      console.log("Devices.update() denied");
      console.log(device);
      console.log(fields);
      console.log(modifier);

      return false;
    }
  });
});

Meteor.publish("new-devices", function() {
  return Devices.findNewDevices();
});

Meteor.publish("user-devices", function() {
  return Devices.findUserDevices(this.userId);
});

/*
 * Used by devices to subscribe to a view of their code.
 * TODO: seriously improve security here. It's too easy to pretend being
 * another device.
 */
Meteor.publish("device-code", function(token) {
  return Devices.find({'token': token}, { 'code': 1});
});

Meteor.methods({
  /* Each device is supposed to have a unique token and use it when connecting. */
  // TODO: add some security here ;) It is a little too easy to be someone's else device
  'register': function(token, software, version, infos) {
    if (token === undefined) {
      return false;
    }
    if (! 'ip' in infos) {
      infos.ip = undefined;
    }
    
    var d = Devices.find({'token': token});
    if (d.count() == 0) {
      var device = {
        'token': token,
        'software': software,
        'version': version,
        'ip': infos.ip,
        'lastSeen': new Date()
      };
      console.log("register(): new device - %j", device);
      // Looks like this is a new device. Let's create a line in database.
      Devices.insert(device);
    }
    else {
      var device = d.fetch()[0];
      Devices.update({_id: device._id}, { $set: {
          'lastSeen': new Date(),
          'ip': infos.ip,
          'software': software,
          'version': version
        }
      });
      console.log("register() from known device - %j", device);
    }
    return true;
  }
});
