Meteor.startup(function() {
  Codes.allow({
    insert: function(userId, doc){
      doc.userId = userId;
      return true;
    },
    'remove': function(userId, doc) {
      if (doc.userId == userId)
        return true;
      else
        return false;
    },
    'update': function(userId, code, fields, modifier) {
      /* Update userId of a device */
      if (fields.length == 1 && fields[0] == "code") {
        return true;
      }
      else
        return false;
    }
  });
});

Meteor.publish("user-codes", function() {
  return Codes.find({ 'userId': this.userId});
});
