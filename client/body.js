Template.page.created = function() {
  analytics.init();
};

/* A very simple router */

var pijsNavigation = [
  {
    'title': "Home",
    'page': 'home',
    'logged': false,
    'render': function() { return Template.home() }
  },
  {
    'title': "Dashboard",
    'page': 'dashboard',
    'logged': true,
    'render': function() { return Template.dashboard() }
  },
  {
    'title': "Editor", 
    'page': 'editor',
    'logged': true,
    'render': function() { return Template.editor() }
  }
];

function navForPage(page) {
  for (var i = 0; i < pijsNavigation.length; i++) {
    if (pijsNavigation[i].page === page) return pijsNavigation[i];
  }
  return undefined;
}

Template.page.content = function() {
  var nav = navForPage(Session.get("page"));
  if (!nav)
    return Template.home();
  if (nav.logged && !Meteor.user())
    return Template.home();
  return nav.render();
};
Template.nav.navLinks = function() {
  if (Meteor.user())
    return pijsNavigation;
  else
    return pijsNavigation.filter(function(e) { return e.logged == false} );
}
Template.navLink.navClass = function() {
  if (Session.get('page') === undefined && this.page === "home")
    return "active";
  if (this.page === Session.get("page"))
    return "active";
  return "";
}
Template.navLink.events({
  'click': function(event, template) {
    Session.set("page", template.data.page);
  }
});
