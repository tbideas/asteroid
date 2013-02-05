
Template.emailForm.showEmailForm = function() {
	return Session.get("emailFormSubmitted") != true;
}

Template.home.events({
	'click #stayintouch button': function(event, template) {
		var email = template.find("input[name='email']").value;
		console.log("Hey thanks!" + email);
		
		Emails.insert({ 'email': email, timestamp: Date.now() });
		
		Session.set("emailFormSubmitted", true);
		return false;
	}
});