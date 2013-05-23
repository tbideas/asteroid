Mailchimp = {
  subscribeMailchimp: function(email, needVerification, cb) {
    var mailchimpApiKey = Meteor.settings.mailchimp && Meteor.settings.mailchimp.apikey;
    var mailchimpListId = Meteor.settings.mailchimp && Meteor.settings.mailchimp.listid;

    if (!mailchimpApiKey || !mailchimpListId) {
      console.log("subscribeEmail - Mailchimp not configured %j", Meteor.settings.mailchimp);
      return false;
    }

    var params = {
      apikey: mailchimpApiKey,
      id: mailchimpListId,
      email_address: email,
      double_optin: needVerification
    };
    console.log("Adding user to mailchimp db");
    Meteor.http.call('GET', 'http://us5.api.mailchimp.com/1.3/?method=listSubscribe',
                     { 'params': params },
                     function(error, result) {
      console.log("Back from mailchimp db call: %j %j", error, result);
      cb(error, result);
    });
  }
}