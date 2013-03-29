Template.page.created = function() {
  analytics.init();
  analytics.page('/');
};

/* A very simple router */

/* Publicly available functions */

function gotoPage(path) {
  Session.set("page", path);
  analytics.page('/' + path);
}

function currentPage() {
  return Session.get("page");
}

/* Private */

var pijsNavigation = [
  {
    'title': "Home",
    'path': 'home',
    'logged': false,
    'render': function() { return Template.home() }
  },
  {
    'title': "Dashboard",
    'path': 'dashboard',
    'logged': true,
    'render': function() { return Template.dashboard() }
  },
  {
    'title': "Editor",
    'path': 'editor',
    'logged': true,
    'render': function() { return Template.editor() }
  },
  {
    'title': "Documentation",
    'path': 'doc',
    'subitems': [
      {
        'title': "Getting Started",
        'path': 'gettingstarted',
        'render': function() { return Template.doc() }
      },
      {
        'title': "Examples",
        'path': 'examples',
        'render': function() { return Template.examples() }
      },
    ],
    'logged': false,
    'render': function() { return Template.doc() }
  }
];

function findPageInNavigation(navigation, path) {
  for (var i = 0; i < navigation.length; i++) {
    if (navigation[i].path == path)
      return navigation[i];
    if (navigation[i].subitems) {
      var subSearch = findPageInNavigation(navigation[i].subitems, path);

      if (subSearch)
        return subSearch;
    }
  }
  return undefined;
}

function getCurrentPage() {
  var page = findPageInNavigation(pijsNavigation, currentPage());

  // Default
  if (!page)
    return pijsNavigation[0];

  // Check that user is authorized to see this page
  if (page.logged && !Meteor.user())
    return pijsNavigation[0];

  return page;
}

Template.page.content = function() {
  var page = getCurrentPage();
  return page.render();
};

Template.nav.navLinks = function() {
  if (Meteor.user())
    return pijsNavigation;
  else
    return pijsNavigation.filter(function(e) { return e.logged == false} );
}

Template.navLink.hasSubItems = function() {
  return this.subitems && this.subitems.length > 0;
}

Template.navLink.navClass = function() {
  var currentPage = getCurrentPage();

  if (this.path === currentPage.path)
    return "active";

  if (this.subitems)
    if (findPageInNavigation(this.subitems, currentPage.path))
      return "active"

  return "";
}

Template.navLink.events({
  'click': function(event, template) {
    if (!template.data.subitems || template.data.subitems.length == 0)
      gotoPage(template.data.path);
  }
});
