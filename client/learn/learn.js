Template.learn.title = function() {
  return Session.get("currentPost").title;
}

Template.learn.content = function() {
  var converter = new Showdown.converter();
  return converter.makeHtml(Session.get("currentPost").content);
}

Template.learn.prerequisites = function() {
  return Session.get("currentPost").prerequisites;
}