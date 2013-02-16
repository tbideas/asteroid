Template.loginError.loginError = function() {
  return Session.get("loginError");
}
socialLoginCallback = function(error) {
  if (error) {
    console.log("Social login error: " + error);
    Session.set("loginError", error.toString());
  }
};
Template.userLoggedOut.events({
  "click .dropdown-toggle": function(e) {
    /* Reset default state before showing form */
    Session.set("userForm", null);
    Session.set("loginError", null);
  },
  "click button[name='forgot']": function(e) {
    Session.set("userForm", "forgot");
    return false;
  },
  "click button[name='signin']": function(e) {
    Session.set("userForm", "signin");
    return false;
  },
  "click button[name='login-twitter']": function(e) {
    Meteor.loginWithTwitter(socialLoginCallback);
    return false;
  },
  "click button[name='login-facebook']": function(e) {
    Meteor.loginWithFacebook(socialLoginCallback);
    return false;
  },
  "click button[name='login-github']": function(e) {
    Meteor.loginWithGithub(socialLoginCallback);
    return false;
  },
  
  "submit form": function(event, template) {
    var email = template.find("#email").value;
    Session.set("loginError", null);
    if (!Session.get("userForm") || Session.get("userForm") == "login") {
      var password = template.find("#password").value;
      Meteor.loginWithPassword(email, password, function (error) {
        Session.set("loginError", error.reason);
      });
    }
    if (Session.get("userForm") == "signin") {
      var password = template.find("#password").value;
      Accounts.createUser({
        'username': email,
        'email': email,
        'password': password
      }, function(error) {
        Session.set("loginError", error.reason);
      });
    }
    if (Session.get("userForm") == "forgot") {
      Accounts.forgotPassword({ 'email': email }, function(error) {
        if (error)
          Session.set("loginError", error.reason);
      });
      Session.set("userForm", "forgotMailSent");
    }
    return false;
  }
});
Template.userForm.userLoginForm = function() {
  if (!Session.get("userForm") || Session.get("userForm") == "login")
    return true;
  return false;
}
Template.userForm.userSigninForm = function() {
  if (Session.get("userForm") == "signin") return true;
  return false;
}
Template.userForm.userForgotForm = function() {
  if (Session.get("userForm") == "forgot") return true;
  return false;
}
Template.userForm.userForgotFormMailSent = function() {
  if (Session.get("userForm") == "forgotMailSent") return true;
  return false;
}

Template.userLoggedIn.userDisplayName = function() {
  if (Meteor.user().profile && Meteor.user().profile.name) 
    return Meteor.user().profile.name;
  if (Meteor.user().username) 
    return Meteor.user().username;
  if (Meteor.user().emails && Meteor.user().emails.length > 0)
    return Meteor.user().emails[0].address;
  return "John Doe";
}
Template.userLoggedIn.events({
  'click #logout': function() {
    Meteor.logout();
  }
});