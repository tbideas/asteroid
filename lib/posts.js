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
    return Meteor.Router.learnPath(this._fancyId());
  },
  fancyUrl: function() {
    return Meteor.Router.learnUrl(this._fancyId());
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

Meteor.methods({
  "post-vote-up": function(postId) {
    console.log("voting up!");
    var post = Posts.findOne(postId);
    
    if (post && post.canVote()) {
      if (! 'votes' in post || typeof post.votes !== "Number") {
        post.votes = 0;
      }
      post.votes = post.votes + 1;
      
      if (! 'voteUp' in post || ! post.voters) {
        post.voters = [];
      }
      post.voters.push(Meteor.user()._id);
      
      Posts.update(postId, { $set: { votes: post.votes, voters: post.voters } });
    }
  }
})