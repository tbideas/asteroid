var saveTimeout;
var editedDoc;
var codeMirror;
var lastSaved;
var lastSaveError;

/* TODO: this interval should probably created/destroyed when the page is displayed/hidden */

var saveMessageInterval = setInterval(function() {
  if (lastSaveError) {
    Session.set("saveMessageClass", "text-error")
    Session.set("saveMessage", "Unable to save. Re-trying...");
  }
  else if (saveTimeout) {
    if (Meteor.status().connected != true) {
      Session.set("saveMessageClass", "text-error")
      Session.set("saveMessage", "Disconnected from server. Re-connecting...");
    }
    else {
      Session.set("saveMessageClass", "muted");
      Session.set("Saving...");
    }
  }
  else if (lastSaved) {
    Session.set("saveMessageClass", "muted");
    Session.set("saveMessage", "Saved and Published " + moment(lastSaved).fromNow())
  }
  else {
    Session.set("saveMessageClass", "muted");
    Session.set("saveMessage", "Start typing: your code will be automatically saved and published to your Raspberry Pi.");
  }
}, 1000);

codeHasChanged = function() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  Session.set("saveMessageClass", "muted");
  Session.set("saveMessage", "Saving...");
  saveTimeout = setTimeout(saveCode, 3000);
}

saveCode = function() {
  Devices.update({_id: editedDoc},
    {$set: { 'code': codeMirror.doc.getValue() }},
    function(error) {
      if (error) {
        console.log("Error saving: %j", error);
        lastSaveError = error;
        saveTimeout = setTimeout(saveCode, 3000);
      }
      else {
        lastSaveError = null;
        lastSaved = moment();
        saveTimeout = null;
      }
    }
    );
}

var documentWatcherHandle;

Template.editor.rendered = function(template) {
  if (!codeMirror) {
    if (!Session.get("editedDoc")) {
      var d = Devices.findOne({}, { sort: { 'lastSeen': -1 }});
      if (d) {
        Session.set("editedDoc", d._id);
        Session.set('editorDisabled', false);
      }
      else {
        Session.set('editorDisabled', true);
        return;
      }
    }
    editedDoc = Session.get("editedDoc");
    codeMirror = CodeMirror(this.find("#code-editor"),
      {
        'value': "Loading...",
        'mode': "javascript",
        'lineNumbers': true,
        'lineWrapping': true,
        'matchBrackets': true,
        'autofocus': true,
        'tabSize': 2,
        'extraKeys': {"Enter": "newlineAndIndentContinueComment"}
      });
    codeMirror.on('change', codeHasChanged);

    /* Watch the device object to update the code window when code is changed */
    documentWatcherHandle = Devices.find({_id: editedDoc}).observeChanges({
      'added': function(id, fields) {
        if (codeMirror) {
          // disable event during change
          codeMirror.off('change', codeHasChanged);
          if ('code' in fields)
            codeMirror.doc.setValue(fields.code);
          else
            codeMirror.doc.setValue('');
          codeMirror.on('change', codeHasChanged);
        }
      },
      'changed': function(id, fields) {
        if (codeMirror && 'code' in fields) {
          if (codeMirror.doc.getValue() != fields.code) {
            // disable event during change
            codeMirror.off('change', codeHasChanged);
            codeMirror.doc.setValue(fields.code);
            codeMirror.on('change', codeHasChanged);
          }
        }
      }
    });
  }
}
Template.editor.destroyed = function(template) {
  if (documentWatcherHandle)
    documentWatcherHandle.stop();
  codeMirror = null;
}
Template.editor.enabled = function(template) {
  return Session.get("editorDisabled") != true;
}
Template.editor.events({
  "click a[name='gettingstarted']": function() {
    router.gotoPage("doc");
  }
});
Template.codeToolbar.deviceName = function() {
  var d = Devices.findOne({_id: Session.get("editedDoc")});
  if (d)
    return d.name;
  else
    return "";
}
Template.codeToolbar.devices = function() {
  return Devices.find({}, { sort: { 'lastSeen': -1 }});
}
Template.saveMessage.saveMessage = function() {
  return Session.get("saveMessage");
}
Template.saveMessage.saveMessageClass = function() {
  return Session.get("saveMessageClass");
}
Template.console.logs = function() {
  return DeviceLogs.tailLogs(Session.get("editedDoc"), 10);
}
Template.console.events({
  'click .clearConsole': function() {
    analytics.event("Editor", "Clear console");
    Meteor.call('deleteDeviceLogs', Session.get("editedDoc"));
  }
});
