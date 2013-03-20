Template.page.created = function() {
  analytics.init();
}

/* A very simple router */
Template.page.content = function() {
	if (Meteor.user()) {
		switch (Session.get("page")) {
			case "home":
        return Template.home();
        break;
			case "dashboard":
				return Template.dashboard();
        break;
			default:
				return Template.dashboard();
        break;
		}
	}
	else {
		return Template.home();
	}
}