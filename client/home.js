
Template.emailForm.showEmailForm = function() {
	return Session.get("emailFormSubmitted") != true;
}

Template.home.events({
	'click #stayintouch button': function(event, template) {
		var email = template.find("input[name='email']").value;
		
		Emails.insert({ 'email': email, timestamp: Date.now() });
		
		Session.set("emailFormSubmitted", true);
		analytics.event("home", "Subscribe to newsletter");
		return false;
	}
});

Template.home.rendered = function() { analytics.page('/home') };