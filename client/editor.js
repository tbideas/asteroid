var editedDocId = '42';
var saveTimeout;
var codeMirror;
var lastSaved;
var lastSaveError;

var saveMessageInterval = setInterval(function() {
  if (saveTimeout) {
    Session.set("saveMessageClass", "muted");
    Session.set("Saving...");
  }
  else if (lastSaveError) {
    Session.set("saveMessageClass", "text-error")
    Session.set("saveMessage", "Unable to save. Re-trying...");
  }
  else if (lastSaved) {
    Session.set("saveMessageClass", "muted");
    Session.set("saveMessage", "Saved " + moment(lastSaved).fromNow())
  }
  else {
    Session.set("saveMessage", "");
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
  Codes.update({_id: editedDocId}, 
    {$set: { 'code': codeMirror.doc.getValue() }},
    function(error) {
      if (error) {
        lastSaveError = error;
        saveTimeout = setTimeout(saveCode, 3000);
      }
      else {
        lastSaveError = null;
        lastSaved = moment();
      }
    }
    );
  saveTimeout = null;
}

Template.editor.created = function(template) {
  Codes.find({_id: editedDocId}).observe({
    'added': function(document, beforeIndex) {
      if (codeMirror) {
        // disable event during change
        codeMirror.off('change', codeHasChanged);
        codeMirror.doc.setValue(document.code);
        codeMirror.on('change', codeHasChanged);
      }
    },
    'changed': function(newDocument, atIndex, oldDocument) {
      if (codeMirror) {
        if (codeMirror.doc.getValue() != newDocument.code) {
          // disable event during change
          codeMirror.off('change', codeHasChanged);
          codeMirror.doc.setValue(newDocument.code);
          codeMirror.on('change', codeHasChanged);
        }
      }
    }
  });
}

Template.editor.rendered = function(template) {
  if (!codeMirror) {
    code = Codes.findOne({_id: editedDocId});
    
    if (code == null) code={ code: "Loading..." };
    
    codeMirror = CodeMirror(this.find("#code-editor"), 
      {
        'value': code.code,
        'mode': "javascript",
        'lineNumbers': true,
        'lineWrapping': true,
        'matchBrackets': true,
        'autofocus': true,
        'tabSize': 2,
        'extraKeys': {"Enter": "newlineAndIndentContinueComment"}
      });
    codeMirror.on('change', codeHasChanged);
  }
}

Template.saveMessage.saveMessage = function() {
  return Session.get("saveMessage");
}
Template.saveMessage.saveMessageClass = function() {
  return Session.get("saveMessageClass");
}