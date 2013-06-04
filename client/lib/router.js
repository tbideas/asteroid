Meteor.Router.add({
  '/': 'home',
  '/dashboard': 'dashboard',
  '/editor/:_id': { 
    as: 'editor', 
    to: function(_id) {
      Session.set('editedDoc', _id);
      return 'editor';
    }
  },
  '/learn/': 'learnList',
  '/learn/:_id': {
    as: 'learn',
    to: function(_id) {
      var post = Posts.findOne({ $or: [ { '_id': _id }, { 'fancyLink': _id } ] });
      if (post) {
        Session.set("currentPost", post);
        return 'learn';
      }
      else {
        return '404';
      }
    }
  },
  '/learn/:_id/edit': {
    as: 'learnEditor',
    to: function(_id) {
      var post = Posts.findOne(_id);
      if (post) {
        Session.set('currentPost', post);
        return 'learnEditor';
      }
      else {
        return '404';
      }
    }
  },
  '/admin/': 'adminDashboard',
  '*': '404'
});

Meteor.Router.filters({
  'checkLoggedIn': function (page) {
    if (Meteor.loggingIn()) {
      return 'loading';
    } else if (Meteor.user()) {
      return page;
    } else {
      return 'home';
    }
  },
  'stats': function(page) {
    if (page in Meteor.Router.namedRoutes) {
      analytics.page(Meteor.Router.namedRoutes[page].path);
    }
    return page;
  },
  'adminOnly': function(page) {
    if (Meteor.user().isAdmin === true) {
      return page;
    }
    else {
      return 'home';
    }
  }
});

Meteor.Router.filter('checkLoggedIn', {
  except: [ 'home', 'learnList', 'learn', '404']
});
Meteor.Router.filter('adminOnly', {
  only: [ 'admin' ]
});
Meteor.Router.filter('stats', {});
