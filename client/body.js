Template.page.created = function() {
  analytics.init();
  analytics.page('/');
};

/* A very simple router */

/* Publicly available functions */

function gotoPage(page) {
  Session.set("page", page);
  analytics.page('/' + page);
}

function currentPage() {
  return Session.get("page");
}

/* Private */

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
  },
  {
    'title': "Documentation",
    'page': 'doc',
    'logged': false,
    'render': function() { return Template.doc() }
  }
];

function navForPage(page) {
  for (var i = 0; i < pijsNavigation.length; i++) {
    if (pijsNavigation[i].page === page) return pijsNavigation[i];
  }
  return undefined;
}

Template.page.content = function() {
  var nav = navForPage(currentPage());
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
  if (currentPage() === undefined && this.page === "home")
    return "active";
  if (this.page === currentPage())
    return "active";
  return "";
}
Template.navLink.events({
  'click': function(event, template) {
    gotoPage(template.data.page);
  }
});
