Template.page.loggedIn = function() {
	return Meteor.user() != null;
}