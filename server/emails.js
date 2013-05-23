Meteor.methods({
  'subscribeEmail': function(email) {
    var id = Emails.insert({ 'email': email, timestamp: Date.now() });
    
    Mailchimp.subscribeMailchimp(email, true, function(error, result) {
      if (error)
        Emails.update({ '_id': id }, { $set: { 'mailchimpSubscribe': error } } );
      else {
        Emails.update({ '_id': id }, { $set: { 'mailchimpSubscribe': result.content } } );
      }
      
      if (Meteor.user()) {
        Meteor.users.update(Meteor.user()._id, { $set: { "profile.mailchimp": "user"} });
      }
    });
  }
})
