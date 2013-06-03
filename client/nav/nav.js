var navLinks = [
  { title: 'Dashboard', to: Meteor.Router.dashboardPath(), logged: true },
  { title: 'Admin', to: Meteor.Router.adminDashboardPath(), logged:true, admin:true},
  { title: 'Documentation', 
    subitems: [
      { title: 'Getting Started', to: Meteor.Router.gettingStartedPath() },
      { title: 'Examples', to: Meteor.Router.examplesPath() },
      { title: 'FAQ', to: Meteor.Router.faqPath() }
    ]
  },
  { title: 'Learn', to: Meteor.Router.learnListPath() }
];

Template.nav.navLinks = function() {
  if (Meteor.user()) {
    if (Meteor.user().isAdmin === true) {
      return navLinks      
    }
    else {
      return _.reject(navLinks, function(e) { return "admin" in e && e['admin'] } );
    }
  }
    
  else
    return _.reject(navLinks, function(e) { return "logged" in e && e['logged'] } );
}

Template.navLink.hasSubItems = function() {
  return this.subitems && this.subitems.length > 0;
}

Template.navLink.navClass = function() {
  var currentPage = Meteor.Router.page();
  var currentPath;
  if (currentPage && currentPage in Meteor.Router.namedRoutes) {
    currentPath = Meteor.Router.namedRoutes[currentPage].path;
  }
  
  if (this.to === currentPath)
    return "active";

  if (this.subitems)
    for (var i in this.subitems) 
      if (i.to === currentPage)
        return "active";
  return "";
}
