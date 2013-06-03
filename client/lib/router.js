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
  '/gettingstarted': { as: 'gettingStarted', to: 'gettingStarted'},
  '/examples': 'examples',
  '/faq': 'faq',
  '/learn/:_id': {
    as: 'learn',
    to: function(_id) {
      var post = Posts.findOne(_id);
      console.log("Setting post: %j", post);
      if (post) {
        Session.set('currentPost', post);
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
      console.log("Setting post: %j", post);
      if (post) {
        Session.set('currentPost', post);
        return 'learnEditor';
      }
      else {
        return '404';
      }
    }
  }
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
  }
});

Meteor.Router.filter('checkLoggedIn', {
  except: [ 'home', 'gettingStarted', 'examples', 'faq', 'learn' ]
});
Meteor.Router.filter('stats', {});
