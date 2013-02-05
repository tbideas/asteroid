Meteor.startup(function () {
	Accounts.emailTemplates.from = '"Asteroid" <asteroid@tbideas.com>';
	Accounts.emailTemplates.siteName = "Asteroid";
});