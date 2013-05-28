var mixpanelId = (Meteor.settings && Meteor.settings.public
  && Meteor.settings.public.analytics) ?
  Meteor.settings.public.analytics.mixpanel : undefined;
var gaAccount = (Meteor.settings && Meteor.settings.public
    && Meteor.settings.public.analytics) ?
  Meteor.settings.public.analytics.ga : undefined;
var analyticsDebug = (Meteor.settings && Meteor.settings.public 
  && Meteor.settings.public.analytics.debug) ?
   Meteor.settings.public.analytics.debug : false;
  
analytics = {
  ga: {
    'init': function() {
      if (!window.gaq) {
        window._gaq = window._gaq || [];
        _gaq.push(['_setAccount', gaAccount]);
        _gaq.push(['_setSiteSpeedSampleRate', 100]);
        _gaq.push(['_trackPageview']);

        (function() {
          var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
          ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
      }
    },
    'page': function(page) {
      _gaq.push(['_trackPageview', page]);
    },
    'event': function(category, action) {
      _gaq.push(['_trackEvent', category, action]);
    }
  },
  mixpanel: {
    'init': function() {
      (function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===e.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f);b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==
      typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,
      e,d])};b.__SV=1.2}})(document,window.mixpanel||[]);
      mixpanel.init(mixpanelId);
    },
    'setVars': function() {
      if(Meteor.user()){
        var currentUserEmail=getUserEmail(Meteor.user());
        mixpanel.identify(Meteor.user()._id);
        mixpanel.name_tag(getUserDisplayName(Meteor.user()));
        mixpanel.people.set({
            '$first_name': getUserDisplayName(Meteor.user()),
            '$username': getUserDisplayName(Meteor.user()),
            '$last_login': new Date(),
            '$created': moment(Meteor.user().createdAt)._d,
            '$email': currentUserEmail,
            'signup': getSignupMethod(Meteor.user())
        });
        mixpanel.register({
            'username': getUserDisplayName(Meteor.user()),
            'createdAt': moment(Meteor.user().createdAt)._d,
            'email': currentUserEmail
        });
        mixpanel.name_tag(currentUserEmail);
      }
    },
    'page': function(page) {
      analytics.mixpanel.setVars();
      mixpanel.track(page);
    },
    'event': function(category, action) {
      analytics.mixpanel.setVars();
      mixpanel.track(action);
    },
    'alias': function(alias) {
      mixpanel.alias(alias);
    },
    'set': function(vars) {
      mixpanel.people.set(vars);
    }
  },
  /* Generic methods that will call specific implementations */
  'init': function() {
    if (gaAccount)
      analytics.ga.init();
    if (mixpanelId)
      analytics.mixpanel.init();
    if (analyticsDebug) 
      console.log("ANALYTICS: init()");
  },
  'page': function(page) {
    if (gaAccount)
      analytics.ga.page(page);
    if (mixpanelId)
      analytics.mixpanel.page(page);
    if (analyticsDebug) 
      console.log("ANALYTICS: page(%s)", page);
  },
  'event': function(category, action) {
    if (gaAccount)
      analytics.ga.event(category, action);
    if (mixpanelId)
      analytics.mixpanel.event(category, action);
    if (analyticsDebug) 
      console.log("ANALYTICS: event(%s, %s)",category, action);
  },
  'alias': function(alias) {
    if (mixpanelId)
      analytics.mixpanel.alias(alias);
  },
  'set': function(vars) {
    if (mixpanelId)
      analytics.mixpanel.set(vars);
  }
};

if (typeof analyticsInitialized === "undefined") {
  analytics.init();
  analyticsInitialized = true;
}