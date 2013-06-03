Template.learnEditor.title = function() {
  return Session.get("currentPost").title;
}

Template.learnEditor.content = function() {
  var converter = new Showdown.converter();
  return Session.get("currentPost").content;
}

Template.learnEditor.prerequisites = function() {
  var array = Session.get("currentPost").prerequisites;

  if (typeof array === "object") {
    for (i = 0; i < array.length; i++) {
      array[i]['__index'] = i;
    }
  }
  return array;
}

Template.learnEditor.events({
  'click .btn#post-save': function(event, template) {
    var button = template.find('button#post-save');
    if (button.enabled !== false) {
      var initialText = button.innerHTML;
      button.enabled = false;    
      button.innerHTML = "Saved!";
    
      Posts.update(Session.get("currentPost")._id, {$set: _.pick(Session.get("currentPost"), 'title', 'content', 'prerequisites') }, function(error) {
        if (error) {
          console.log("Error saving currentPost: %j", error);
          button.innerHTML = "Unable to save!";
          setTimeout(function() {
            button.innerHTML = initialText;
            button.enabled = true;
        
          }, 2000);          
        }
        else {
          setTimeout(function() {
            button.innerHTML = initialText;
            button.enabled = true;
        
          }, 500);          
        }
      });
    }
  },
  'keyup input, keyup textarea': function(event, template) {
    console.log("text area changed");
    var post = Session.get("currentPost");
    post.title = template.find("input").value;
    post.content = template.find("textarea").value;
    Session.set("currentPost", post);
  },
  'click #addPrereq': function(event, template) {
    console.log("add Prereq");
    var post = Session.get("currentPost");
    if (typeof post.prerequisites !== "object") {
      post.prerequisites = [];
    }
    post.prerequisites.push({
      title: "",
      link: "",
      img: "",
      description: ""
    });
    Session.set("currentPost", post);
  }
})

Template.editPrereq.events({
  'keyup input': function(event, template) {
    event.stopImmediatePropagation();
    var idx = template.data.__index;
    
    var post = Session.get("currentPost");
    var prereq = post.prerequisites[idx];
    prereq.title = template.find("input[name='title']").value;
    prereq.description = template.find("input[name='description']").value;
    prereq.img = template.find("input[name='img']").value;
    prereq.link = template.find("input[name='link']").value;
    post.prerequisites[idx] = prereq;
    Session.set("currentPost", post);
  }
})