Template.page.created = function() {
  analytics.init();
  analytics.page('/');
};

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
      {
        'title': "FAQ",
        'path': 'faq',
        'render': function() { return Template.faq() }
      },
    ],
    'logged': false,
    'render': function() { return Template.doc() }
  }
];
router = new SimpleRouter(pijsNavigation);


Template.page.content = function() {
  var page = router.getCurrentPage();
  return page.render();
};

Template.nav.navLinks = function() {
  return router.navLinks(Meteor.user());
}

Template.navLink.hasSubItems = function() {
  return this.subitems && this.subitems.length > 0;
}

Template.navLink.navClass = function() {
  var currentPage = router.getCurrentPage();

  if (this.path === currentPage.path)
    return "active";

  if (this.subitems)
    if (router.pageFromPathInNav(this.subitems, currentPage.path))
      return "active"

  return "";
}

Template.navLink.events({
  'click': function(event, template) {
    if (!template.data.subitems || template.data.subitems.length == 0)
      router.gotoPage(template.data.path);
  }
});
Template.userVoiceItem.events({
  'click': function(event, template) {
    event.preventDefault();

    UserVoice.push(['showLightbox', 'classic_widget', {
      mode: 'full',
      primary_color: '#cc6d00',
      link_color: '#007dbf',
      default_mode: 'support',
      forum_id: 205991
    }]);

  }
});
