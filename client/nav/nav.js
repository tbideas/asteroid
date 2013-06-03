var navLinks = [
  { title: 'Dashboard', to: Meteor.Router.dashboardPath(), logged: true },
  { title: 'Documentation', 
    subitems: [
      { title: 'Getting Started', to: Meteor.Router.gettingStartedPath() },
      { title: 'Examples', to: Meteor.Router.examplesPath() },
      { title: 'FAQ', to: Meteor.Router.faqPath() }
    ]
  },
  { title: 'Learn', to: Meteor.Router.learnPath(1) }
];

Template.nav.navLinks = function() {
  if (Meteor.user())
    return navLinks
  else
    return _.reject(navLinks, function(e) { return "logged" in e && e['logged'] } );
}

Template.navLink.hasSubItems = function() {
  return this.subitems && this.subitems.length > 0;
}

Template.navLink.navClass = function() {
  var currentPage = Meteor.Router.page();

  if (this.to === currentPage)
    return "active";

  if (this.subitems)
    for (var i in this.subitems) 
      if (i.to === currentPage)
        return "active";
  return "";
}
