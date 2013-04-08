Meteor.startup(function () {
  if (Meteor.settings.emails && Meteor.settings.emails.from)
    Accounts.emailTemplates.from = Meteor.settings.emails.from;

  Accounts.emailTemplates.siteName = "pijs.io";
});
