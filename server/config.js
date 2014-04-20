ServiceConfiguration.configurations.remove({
  service: "twitter"
});

if (Meteor.settings.twitter) {
  ServiceConfiguration.configurations.insert({
    service: "twitter",
    consumerKey: Meteor.settings.twitter.token,
    secret: Meteor.settings.twitter.key
  });
}

ServiceConfiguration.configurations.remove({
  service: "github"
});
if (Meteor.settings.github) {
  ServiceConfiguration.configurations.insert({
    service: "github",
    clientId: Meteor.settings.github.token,
    secret: Meteor.settings.github.key
  });
}

ServiceConfiguration.configurations.remove({
  service: "facebook"
});
if (Meteor.settings.facebook) {
  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: Meteor.settings.facebook.token,
    secret: Meteor.settings.facebook.key
  });
}

console.log(ServiceConfiguration.configurations.find().fetch());
