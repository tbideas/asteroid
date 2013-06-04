var disqusShortname = (Meteor.settings && Meteor.settings.public
  && Meteor.settings.public.disqus) ?
  Meteor.settings.public.disqus.shortname : undefined;
  
if (disqusShortname) {
  // this needs to be set as a global var.
  window.disqus_shortname = disqusShortname;
  (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
}