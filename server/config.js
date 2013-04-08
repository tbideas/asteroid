Accounts.loginServiceConfiguration.remove({
  service: "twitter"
});

if (Meteor.settings.twitter) {
  Accounts.loginServiceConfiguration.insert({
    service: "twitter",
    consumerKey: Meteor.settings.twitter.token,
    secret: Meteor.settings.twitter.key
  });
}

Accounts.loginServiceConfiguration.remove({
  service: "github"
});
  if (Meteor.settings.github) {
  Accounts.loginServiceConfiguration.insert({
    service: "github",
    clientId: Meteor.settings.github.token,
    secret: Meteor.settings.github.key
  });
}

Accounts.loginServiceConfiguration.remove({
  service: "facebook"
});
if (Meteor.settings.facebook) {
  Accounts.loginServiceConfiguration.insert({
    service: "facebook",
    appId: Meteor.settings.facebook.token,
    secret: Meteor.settings.facebook.key
  });
}

console.log(Accounts.loginServiceConfiguration.find().fetch());
