Template.learn.post = function() {
  return new Post(Session.get("currentPost"));
}
Template.learn.contentHTML = function() {
  var converter = new Showdown.converter();
  return converter.makeHtml(this.content);
}
Template.learn.canVote = function() {
  return this.canVote();
}
Template.learn.events({
  'click button[name="voteUp"]': function(event, template) {
    this.voteUp();
  }
})
Template.learn.rendered = function() {
  var post = Session.get("currentPost");
  
  if (post && typeof DISQUS === "object") {
    DISQUS.reset({
      reload: true,
      config: function () {  
        this.page.identifier = post.__id;  
        this.page.title = post.title;
        this.page.url = post.fancyUrl();
      }
    });
  }
}