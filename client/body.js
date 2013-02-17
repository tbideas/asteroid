Template.page.created = function() {
  analytics.init();
}

Template.page.gettingstarted = function() {
  console.log("Session.get('gettingstarted'): %s", 
    Session.get("gettingstarted"));
  if (Session.get("gettingstarted")) return true;
  return false;
}