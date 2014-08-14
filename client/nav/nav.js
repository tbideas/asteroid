var navLinks = [
  { title: 'Dashboard', to: Router.path('dashboard'), logged: true },
  { title: 'Admin', to: Router.path('adminDashboard'), logged:true, admin:true},
  { title: 'Learn', to: Router.path('learnList') }
];

Template.nav.navLinks = function() {
  if (Meteor.user()) {
    if (Meteor.user().isAdmin === true) {
      return navLinks;
    }
    else {
      return _.reject(navLinks, function(e) { return "admin" in e && e['admin'] } );
    }
  }
  else
    return _.reject(navLinks, function(e) { return "logged" in e && e['logged'] } );
};

Template.navLink.hasSubItems = function() {
  return this.subitems && this.subitems.length > 0;
};

Template.navLink.navClass = function() {
  var currentPage = Router.current();
  var currentPath;
  if (currentPage) {
    currentPath = currentPage.path;
  }

  if (currentPath && currentPath.indexOf(this.to) == 0)
    return "active";

  return "";
};
