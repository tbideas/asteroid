Template.loginError.loginError = function() {
  return Session.get("loginError");
}
signupCallback = function(provider, error) {
  if (error) {
    console.log("Signup error: %s", error.message);
    Session.set("loginError", error.message);
  }
  else {
    // Alias the new userId to the already existing anonymous profile
    // see: https://mixpanel.com/docs/integration-libraries/using-mixpanel-alias
    analytics.alias(Meteor.user()._id);
    analytics.event("Signup+Login", "NewUser-" + provider);

    Meteor.Router.to('dashboard');
  }
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
    Meteor.loginWithTwitter({}, function(error) { signupCallback('twitter', error) } );
    analytics.event("Signup+Login", "Signin Twitter");
    return false;
  },
  "click button[name='login-facebook']": function(e) {
    Meteor.loginWithFacebook({ requestPermissions: [ 'email' /*, 'publish_actions' */ ]}, function(error) { signupCallback('facebook', error) });
    analytics.event("Signup+Login", "Signin Facebook");
    return false;
  },
  "click button[name='login-github']": function(e) {
    Meteor.loginWithGithub({ requestPermissions: [ 'user:email' /* , 'gist' */ ]}, function(error) { signupCallback('github', error) });
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
          Meteor.Router.to('dashboard');
      });
      analytics.event("Signup+Login", "Login password");
    }

    /* New user signing in with email and password */
    if (Session.get("userForm") == "signin") {
      var password = template.find("#password").value;
      Accounts.createUser({
          'username': email,
          'email': email,
          'password': password
        },
        function(error) {
          signupCallback('password', error)
        }
      );
      analytics.event("Signup+Login", "Signing password");
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
