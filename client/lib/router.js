Meteor.Router.add({
  '/': 'home',
  '/dashboard': 'dashboard',
  '/editor': 'editor',
  '/gettingstarted': { as: 'gettingStarted', to: 'doc'},
  '/examples': 'examples',
  '/faq': 'faq'
});