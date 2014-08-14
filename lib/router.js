Router.map(function() {
  this.route('home', { path: '/' });
  this.route('dashboard');

  /* Admin pages */
  this.route('adminDashboard', {
    path: '/admin/'
  });

  this.route('editor', {
    path: '/editor/:_id',
    data: function () {
      Session.set('editedDoc', this.params._id);
    }
  });

  /* Learn pages */
  this.route('learnList', { path: '/learn/' });
  this.route('learn', {
    path: '/learn/:_fancyId',
    template: 'learnView',
    data: function() {
      Session.set("currentPostId", this.params._fancyId);
    }
  });
  this.route('learnEditor', {
    path: '/learn/:_id/edit',
    data: function() {
      Session.set("currentPostId", this.params._id);
    }
  });

  this.route('404', { path: '*' });
});
Router.configure({
  layoutTemplate: 'layout',
  load: function() {
    analytics.page(document.location.pathname);
  }
});

var mustBeAdmin = function(pause) {
  if (!Meteor.user() || !Meteor.user().isAdmin) {
    this.render('home');
    pause();
  }
}
var mustBeLogged = function(pause) {
  if (Meteor.loggingIn()) { //still logging in
    pause();
  }
  if (!Meteor.user()) {  //not logged in
    this.render('home');
    pause();
  }
};

Router.onBeforeAction(mustBeLogged, { except: [ 'home', 'learn', 'learnList', '404' ] } );
Router.onBeforeAction(mustBeAdmin, { only: [ 'adminDashboard', 'learnEditor' ] } );
