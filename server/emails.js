Meteor.startup(function(){
  Emails.allow({
  	insert: function(userId, doc){
			doc['originip'] = "127.0.0.1";
			return true;
		}
	});
});
	
	
