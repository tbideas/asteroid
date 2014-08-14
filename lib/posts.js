Post = function (doc) {
  // Default values
  _.extend(this, {
    title: '',
    summary: '',
    createdAt: new Date(),
    img: '',
    link: '',
    content: '',
    votes: 0,
    voters: []
  });
  _.extend(this, doc);
};

_.extend(Post.prototype, {
  _fancyId: function() {
    if (this.fancyLink) return this.fancyLink;
    return this._id;
  },
  fancyPath: function() {
    return Router.routes['learn'].path(this);
  },
  fancyUrl: function() {
    return Router.routes['learn'].path(this);
  },
  
  voteUp: function() {
    if (this.canVote()) {
      Meteor.call("post-vote-up", this._id);
    }
  },
  canVote: function() {
    if (Meteor.user()) {
      return ! _.contains(this.voters, Meteor.user()._id);
    }
    else {
      return false;
    }
  },
  deployTo: function(deviceId) {
    Devices.update(deviceId, {$set: { code: this.code }});
  }
});

Posts = new Meteor.Collection("posts", {
  transform: function (doc) { 
    return new Post(doc); 
  }
});

Posts.findOneWithFancyId = function(fancyId) {
  return Posts.findOne({ $or: [ { '_id': fancyId }, { 'fancyLink': fancyId } ] });
};

Meteor.methods({
  "post-vote-up": function(postId) {
    console.log("voting up!");
    var post = Posts.findOne(postId);
    
    if (post && post.canVote()) {
      if (! 'voters' in post || ! post.voters) {
        post.voters = [];
      }
      post.voters.push(Meteor.user()._id);
      post.votes = post.voters.length;
      
      Posts.update(postId, { $set: { votes: post.votes, voters: post.voters } });
    }
  }
});
