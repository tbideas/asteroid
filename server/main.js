Meteor.startup(function () {
  Accounts.emailTemplates.from = '"piJS.io" <pijs@tbideas.com>';
  Accounts.emailTemplates.siteName = "piJS.io";
});
