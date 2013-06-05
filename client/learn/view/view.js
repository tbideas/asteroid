Template.learnView.post = function() {
  var id = Session.get('currentPostId');
  return Posts.findOneWithFancyId(id);
}
Template.learnViewContent.contentHTML = function() {
  var converter = new Showdown.converter();
  return converter.makeHtml(this.content);
}
Template.learnViewContent.canVote = function() {
  return this.canVote();
}
Template.learnViewContent.canDeploy = function() {
  return this.code && this.code !== "";
}
Template.learnViewContent.events({
  'click button[name="voteUp"]': function(event, template) {
    analytics.event("Learn", "Vote");
    this.voteUp();
  },
  'click button[name="deploy"]': function(event, template) {
    if (Meteor.user()) {
      var userDevices = Devices.findUserDevices(Meteor.user()._id);
      
      // User has no device - Invite him to connect one
      if (userDevices.count() == 0) {
        analytics.event("Learn", "Deploy-NoDevice");
        $('#connectToDeployModal').modal();
      }
      // User has only one device - Deploy there
      else if (userDevices.count() == 1) {
        analytics.event("Learn", "Deploy");
        var deviceId = userDevices.fetch()[0]._id;
        this.deployTo(deviceId);
        Meteor.Router.to('editor', deviceId);
      }
      // User has several devices - Ask him where to deploy
      else {
        analytics.event("Learn", "Deploy-ChooseTarget");
        $('#chooseDeployTargetModal').modal();
      }
    }
    // User is not logged in - Invite him to connect a device
    else {
      analytics.event("Learn", "Deploy-NotLoggedIn");
      $('#connectToDeployModal').modal();
    }
  }
})
Template.learnViewComments.rendered = function() {
  var post = this.data;
  if (typeof DISQUS === "object") {
    DISQUS.reset({
      reload: true,
      config: function () {  
        this.page.identifier = post.__id;  
        this.page.title = post.title;
        this.page.url = post.fancyUrl();
      }
    });
  }
}

Template.connectToDeployModal.events({
  'click': function() {
    $('#connectToDeployModal').modal("hide");
  }
})

Template.chooseDeployTargetModal.userDevices = function() {
  if (Meteor.user()) {
    return Devices.findUserDevices(Meteor.user()._id);
  }
  else {
    return [];
  }
}
Template.chooseDeployTargetModal.events({
  'click': function() {
    $('#chooseDeployTargetModal').modal("hide");
  }
})

Template.deployTargetModalDevice.lastSeen = function() {
  return moment(this.lastSeen).fromNow();
}
Template.deployTargetModalDevice.events({
  'click .btn': function() {
    analytics.event("Learn", "Deploy");
    var post = Posts.findOneWithFancyId(Session.get("currentPostId"));
    post.deployTo(this._id);
    $('#chooseDeployTargetModal').modal("hide");
    Meteor.Router.to('editor', this._id);
  }
})
