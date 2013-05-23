Meteor.methods({
  // Take all users in database and add them to our mailchimp mailing list
  // this is just meant to be called once - new users are added automatically.
  "subscribe-users": function(filter) {  
    if ('isAdmin' in Meteor.user() && Meteor.user().isAdmin === true) {
      var collected = [];
      Meteor.users.find(filter).forEach(function(user) {
        if ('emails' in user && !('mailchimp' in user.profile && user.profile.mailchimp)) {
          user.emails.forEach(function(email) {
            if (email.address) {
              collected.push(email.address);

              Mailchimp.subscribeMailchimp(email.address, false, function(error, result) {
                if (!error) {
                  if (result.content == 'true') {
                    Meteor.users.update(user._id, { $set: { "profile.mailchimp": "batch"} })
                  }
                  else if (result.content.indexOf("is already subscribed") != -1) {
                    Meteor.users.update(user._id, { $set: { "profile.mailchimp": "user"} })
                  }
                  else {
                    Meteor.users.update(user._id, { $set: { "profile.mailchimpError": result.content } })
                  }
                }
                else {
                  Meteor.users.update(user._id, { $set: { "profile.mailchimpError": error }});
                }
              });
              // We can return from processing this user. One subscription is enough.
              return;
            }
          });
        }
      });
      return collected;
    }
    else {
      return false;
    }
  }  
});
