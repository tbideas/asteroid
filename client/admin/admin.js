Template.adminDashboard.posts = function() {
  return Posts.find();
}

Template.adminDashboard.events({
  'click button[name="buttonNewPost"]': function(event, template) {
    var postId = Posts.insert(createNewPosts());
    Meteor.Router.to('learnEditor', postId);
  }
});

Template.adminPost.events({
  'click button[name="edit"]': function(event, template) {
    Meteor.Router.to('learnEditor', template.data._id);
  },
  'click button[name="delete"]': function(event, template) {
    var result = confirm("Are you sure?");
    
    if (result) {
      Posts.remove(template.data._id);
    }
  }
})
/*

// This is what needs to be ran on the mongodb to calculate stats.

var mapFunction = function() { emit(this.deviceId, { count: 1 } ); };

var reduceFunction = function(deviceId, values) { var count = 0; values.forEach(function(v) { count += v['count'];}); return { count: count }; };

db.devicelogs.mapReduce(mapFunction, reduceFunction, { out: "devicelogsCount" });

// And then to get the results

db.devicelogsCount.find().sort( { "value" : -1 } )

*/