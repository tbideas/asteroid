Template.learnList.posts = function() {
  return Posts.find({}, {sort: { createdAt:1 }});
}
Template.learnPost.fancyPath = function() {
  return this.fancyPath();
}