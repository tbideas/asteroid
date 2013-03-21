Template.loginError.loginError = function() {
  return Session.get("loginError");
}
socialLoginCallback = function(error) {
  if (error) {
    console.log("Social login error: " + error);
    Session.set("loginError", error.toString());
  }
  else
    gotoPage('dashboard');
};
Template.userLoggedOut.events({
  "click .dropdown-toggle": function(e) {
    /* Reset default state before showing form */
    Session.set("userForm", null);
    Session.set("loginError", null);
    analytics.event("Signup+Login", "Show Dropwdown");
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
    analytics.event("Signup+Login", "Signin Twitter");
    return false;
  },
  "click button[name='login-facebook']": function(e) {
    Meteor.loginWithFacebook(socialLoginCallback);
    analytics.event("Signup+Login", "Signin Facebook");
    return false;
  },
  "click button[name='login-github']": function(e) {
    Meteor.loginWithGithub(socialLoginCallback);
    analytics.event("Signup+Login", "Signin Github");
    return false;
  },

  "submit form": function(event, template) {
    var email = template.find("#email").value;
    Session.set("loginError", null);

    /* Login with email and password */
    if (!Session.get("userForm") || Session.get("userForm") == "login") {
      var password = template.find("#password").value;
      Meteor.loginWithPassword(email, password, function (error) {
        if (error)
          Session.set("loginError", error.reason);
        else
          gotoPage('dashboard');
      });
      analytics.event("Signup+Login", "Signin password");
    }

    /* New user signing in with email and password */
    if (Session.get("userForm") == "signin") {
      var password = template.find("#password").value;
      Accounts.createUser({
        'username': email,
        'email': email,
        'password': password
      }, function(error) {
        if
          (error) Session.set("loginError", error.reason);
        else
          gotoPage('dashboard');
      });
      analytics.event("Signup+Login", "Signup with password");
    }

    /* User forgot his email */
    if (Session.get("userForm") == "forgot") {
      Accounts.forgotPassword({ 'email': email }, function(error) {
        if (error)
          Session.set("loginError", error.reason);
      });
      Session.set("userForm", "forgotMailSent");
      analytics.event("Signup+Login", "Password forgotten");
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
  return getUserDisplayName(Meteor.user());
}
Template.userLoggedIn.userAvatar = function() {
  return getUserAvatarUrl(Meteor.user());
}

Template.userLoggedIn.events({
  'click #logout': function() {
    analytics.event("Signup+Login", "Logout");
    Meteor.logout();
  }
});
