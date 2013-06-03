Meteor.publish('posts', function() {
  return Posts.find();
});

Meteor.startup(function(){
  Posts.allow({
    'insert': function(userId, doc) {
      if (Meteor.user().isAdmin === true) {
        return true;
      }
    },
    'update': function(userId, device, fields, modifier) {
      if (Meteor.user().isAdmin === true) {
        return true;
      }
    },
    'remove': function(userId, doc) {
      if (Meteor.user().isAdmin === true) {
        return true;
      }
    }
  });
});
