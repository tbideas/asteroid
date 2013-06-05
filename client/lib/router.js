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
    to: 'learnView',
    and: function(_id) {
      Session.set("currentPostId", _id);
    }
  },
  '/learn/:_id/edit': {
    as: 'learnEditor',
    to: 'learnEditor', 
    and: function(_id) {
      Session.set("currentPostId", _id);
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
  'adminOnly': function(page) {
    if (Meteor.user().isAdmin === true) {
      return page;
    }
    else {
      return 'home';
    }
  }
});

Meteor.startup(function() {
  Meteor.autorun(function() {
    // Thanks Telescope for this nice trick ;)
    // grab the current page from the router, so this re-runs every time it changes
    Meteor.Router.page();

    if(Meteor.Router.page() !== "loading" && !Meteor.loggingIn()){
      // Run in non-reactive context to avoid change to user forcing re-running this.
      Deps.nonreactive(function() {
        analytics.page(document.location.pathname);
      });
    }
  });
});

Meteor.Router.filter('checkLoggedIn', {
  except: [ 'home', 'learnList', 'learnList', 'learnView', '404']
});
Meteor.Router.filter('adminOnly', {
  only: [ 'admin', 'learnEditor' ]
});
