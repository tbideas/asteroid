Accounts.loginServiceConfiguration.remove({
  service: "twitter"
});
Accounts.loginServiceConfiguration.insert({
  service: "twitter",
  appId: process.env.TWITTER_TOKEN,
  secret: process.env.TWITTER_KEY
});

Accounts.loginServiceConfiguration.remove({
  service: "github"
});
Accounts.loginServiceConfiguration.insert({
  service: "github",
  appId: process.env.GITHUB_TOKEN,
  secret: process.env.GITHUB_KEY
});

Accounts.loginServiceConfiguration.remove({
  service: "facebook"
});
Accounts.loginServiceConfiguration.insert({
  service: "facebook",
  appId: process.env.FACEBOOK_TOKEN,
  secret: process.env.FACEBOOK_KEY
});

console.log(Accounts.loginServiceConfiguration.find().fetch());