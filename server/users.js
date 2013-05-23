Accounts.onCreateUser(function(options, user){
  user.profile = options.profile || {};

  var email = getUserEmail(user);
  if (email) {
    email = email.trim().toLowerCase();
    user.email_hash =  CryptoJS.MD5(email).toString();

    // Automatically subscribe user to our low-volume mailing list
    Mailchimp.subscribeMailchimp(email, false, function(error, result) {
      if (!error) {
        if (result.content == 'true') {
          user.profile.mailchimp = "auto";
        }
        else if (result.content.indexOf("is already subscribed") != -1) {
          // User had already enrolled in our mailing list - cool!
          user.profile.mailchimp = "user";
        }
        else {
          user.profile.mailchimpError = result.content;
        }
      }
      else {
        user.profile.mailchimpError = error;
      }
    });
    
  }

  if (!user.profile.name)
    user.profile.name = user.username;

  if ( !Meteor.users.find().count() )
    user.isAdmin = true;

  var newUserEmail = Meteor.settings.emails && Meteor.settings.emails.newUserEmail
  if (newUserEmail) {
    var emailText = 'Hi there!\n\n'
     + 'A new user, going with the name ' + getUserDisplayName(user) + ' has joined pijs.io.\n'
     + 'His complete profile is: \n'
     + JSON.stringify(user)
     + '\n\n'
     + 'Cheers!\n'
     + 'pijs.io';

    Email.send({
      from: Meteor.settings.emails.from,
      to: newUserEmail,
      subject: 'New user on pijs.io: ' + getUserDisplayName(user) + " (" + getSignupMethod(user) + ")",
      text: emailText
    });
  }

  return user;
});

Meteor.publish('current-user', function() {
  return Meteor.users.find(this.userId);
});
