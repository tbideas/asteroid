
Template.emailForm.showEmailForm = function() {
  return Session.get("emailFormSubmitted") != true;
}

Template.home.events({
  'click #stayintouch button': function(event, template) {
    var email = template.find("input[name='email']").value;

    Session.set("emailFormSubmitted", true);
    analytics.event("home", "Subscribe to newsletter");

    Meteor.call('subscribeEmail', email);
    return false;
  }
});
