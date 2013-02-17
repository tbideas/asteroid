Accounts.onCreateUser(function(options, user){
  user.profile = options.profile || {};
  
  var email = getUserEmail(user);
  if (email) {
    email = email.trim().toLowerCase();
    user.email_hash =  CryptoJS.MD5(email).toString();
  }
  
  if (!user.profile.name)
    user.profile.name = user.username;
  
  if ( !Meteor.users.find().count() )
    user.isAdmin = true;

  return user;
});

Meteor.publish('current-user', function() {
  return Meteor.users.find(this.userId);
});