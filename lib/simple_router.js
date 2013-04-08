/* A very simple router */

/* Publicly available functions */

SimpleRouter = function(navigationTree) {
  this.navigation = navigationTree;
}

SimpleRouter.prototype.gotoPage = function(path) {
  Session.set("page", path);
  analytics.page('/' + path);
}

SimpleRouter.prototype.currentPage = function() {
  return Session.get("page");
}

SimpleRouter.prototype.navLinks = function(logged) {
  if (Meteor.user())
    return this.navigation;
  else
    return this.navigation.filter(function(e) { return e.logged == false} );
}

/* Private methods */

SimpleRouter.prototype.pageFromPathInNav = function(navigation, path) {
  for (var i = 0; i < navigation.length; i++) {
    if (navigation[i].path == path)
      return navigation[i];
    if (navigation[i].subitems) {
      var subSearch = this.pageFromPathInNav(navigation[i].subitems, path);

      if (subSearch)
        return subSearch;
    }
  }
  return undefined;
}

SimpleRouter.prototype.getCurrentPage = function() {
  var page = this.pageFromPathInNav(this.navigation, this.currentPage());

  // Default
  if (!page)
    return this.navigation[0];

  // Check that user is authorized to see this page
  if (page.logged && !Meteor.user())
    return this.navigation[0];

  return page;
}
