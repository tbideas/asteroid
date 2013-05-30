Template.home.rendered = function() {
  // Manually call the twitter renderer
  setTimeout(function() {
    if (typeof twttr !== 'undefined') {
      twttr.widgets.load(this.firstNode);;
    }
  }, 0);
}


Template.emailForm.showEmailForm = function() {
  return Session.get("emailFormSubmitted") != true;
}

Template.home.events({
  'click #stayintouch button': function(event, template) {
    var email = template.find("input[name='email']").value;

    Session.set("emailFormSubmitted", true);
    analytics.event("home", "Subscribe to newsletter");
    analytics.set({ 'newsletter-subscribed': true});

    Meteor.call('subscribeEmail', email);
    return false;
  }
});
