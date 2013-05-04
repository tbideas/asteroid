Meteor.startup(function () {
  if (Meteor.settings.emails && Meteor.settings.emails.mailURL) {
    process.env.MAIL_URL = Meteor.settings.emails.mailURL;
  }
  else {
    console.error("No Settings.emails.mailURL set!");
  }

  if (Meteor.settings.emails && Meteor.settings.emails.from) {
    Accounts.emailTemplates.from = Meteor.settings.emails.from;
  }

  Accounts.emailTemplates.siteName = "pijs.io";
});
