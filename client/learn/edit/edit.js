Template.learnEditor.created = function() {
  Meteor.autorun(function() {
    var currentPost = Posts.findOne(Session.get("currentPostId"));
    Session.set("currentPost", currentPost);
  })
}
Template.learnEditor.post = function() {
  // Save the edtited post in session so that we get reactive notification when we change it
  // This way all the interface will update when the post change - even though we are not writing
  // it to the data base yet.
  return new Post(Session.get("currentPost"));
}
Template.editTab.fancyLink = function() {
  var post = this;
  var dbPost = Posts.findOne(post._id);
  
  // If the user has not saved yet, we want the fancy link to change when the title does.
  if (dbPost && (!dbPost.fancyLink || dbPost.fancyLink === ""))
  {
    var fancyLink = post.title.toLowerCase();
    fancyLink = fancyLink.replace(/\s+/gi, '-');
    fancyLink = fancyLink.replace(/[^\w_-]/gi, '');
    return fancyLink;
  }
  else {
    return post.fancyLink;
  }
}

Template.editTab.content = function() {
  var converter = new Showdown.converter();
  return this.content;
}

Template.prerequisitesTab.prerequisites = function() {
  var array = this.prerequisites;

  if (typeof array === "object") {
    for (i = 0; i < array.length; i++) {
      array[i]['__index'] = i;
    }
  }
  return array;
}

Template.editTab.events({
  'click .btn#post-save': function(event, template) {
    var button = template.find('button#post-save');
    if (button.enabled !== false) {
      var initialText = button.innerHTML;
      button.innerHTML = "Saved!";
      button.enabled = false;    
          
      var post = template.data;
      Posts.update(post._id, {$set: _.pick(post, 'title', 'summary', 'image', 'fancyLink', 'content', 'prerequisites', 'code') },
       function(error) {
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
    var post = template.data;
    post.title = template.find("input[name='title']").value;
    post.summary = template.find("textarea[name='summary']").value;
    post.image = template.find("input[name='image']").value;
    post.fancyLink = template.find("input[name='fancyLink']").value;
    post.content = template.find("textarea[name='content']").value;
    Session.set("currentPost", post);
  }
});

Template.prerequisitesTab.events({
  'click button[name="addPrereq"]': function(event, template) {
    event.preventDefault();
    var post = this;
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
  /* Update pre-requisites */
  'keyup input': function(event, template) {
    event.stopImmediatePropagation();
    var post = Session.get("currentPost");
    
    var idx = template.data.__index;
    var prereq = post.prerequisites[idx];

    prereq.title = template.find("input[name='title']").value;
    prereq.description = template.find("input[name='description']").value;
    prereq.img = template.find("input[name='img']").value;
    prereq.link = template.find("input[name='link']").value;
    post.prerequisites[idx] = prereq;
    Session.set("currentPost", post);
  },
  /* Delete action */
  'click button': function(event, template) {
    event.preventDefault();
    var idx = template.data.__index;
    
    var post = Session.get("currentPost");
    post.prerequisites.splice(idx, 1);
    Session.set("currentPost", post);
  }
})

Template.codeTab.events({
  'keyup textarea': function(event, template) {
    var post = template.data;
    post.code = template.find("textarea[name='code']").value;
    Session.set("currentPost", post);
  }
})