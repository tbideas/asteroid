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
  '/gettingstarted': { as: 'gettingStarted', to: 'doc'},
  '/examples': 'examples',
  '/faq': 'faq'
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
  }
});

Meteor.Router.filter('checkLoggedIn', {
  except: [ 'home', 'gettingStarted', 'examples', 'faq' ]
});