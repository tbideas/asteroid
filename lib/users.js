getUserEmail = function(user){
  if(getSignupMethod(user)=='twitter'){
    return user.profile.email;
  }else if(user.emails){
    return user.emails[0].address || user.emails[0].email;
  }else if(user.profile && user.profile.email){
    return user.profile.email;
  }else{
    return '';
  }
}

getUserAvatarUrl = function(user){
  if(getSignupMethod(user)=='twitter') {
    return 'https://api.twitter.com/1/users/profile_image?screen_name='+user.services.twitter.screenName;
  }
  else{
    return Gravatar.getGravatar(user, {
      /* d: 'http://demo.telesc.pe/img/default_avatar.png',*/
      s: 30
    });
  }
}

getUserDisplayName = function(user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  if (user.username)
    return Meteor.user().username;
  if (user.emails && user.emails.length > 0)
    return user.emails[0].address;
  return "John Doe";
}

getSignupMethod = function(user){
  if(user.services && user.services.twitter){
    return 'twitter';
  }
  else{
    return 'regular';
  }
}
