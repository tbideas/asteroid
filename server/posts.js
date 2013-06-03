Meteor.publish('posts', function() {
  return Posts.find();
});

Meteor.startup(function(){
  Posts.allow({
    'insert': function(userId, doc) {
      console.log("HEY FIXME!");
      return true;
    },
    'update': function(userId, device, fields, modifier) {
      return true;
    }
  });
});
