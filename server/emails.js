Meteor.startup(function(){
  Emails.deny({
    insert: function(userId, doc){
      doc['originip'] = "127.0.0.1";
      return false;
    }
  });

  Emails.allow({
    insert: function(userId, doc){
      return true;
    }
  });
});


