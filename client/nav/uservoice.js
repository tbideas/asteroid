Template.userVoiceItem.events({
  'click': function(event, template) {
    event.preventDefault();

    UserVoice.push(['showLightbox', 'classic_widget', {
      mode: 'full',
      primary_color: '#cc6d00',
      link_color: '#007dbf',
      default_mode: 'support',
      forum_id: 205991
    }]);
    analytics.event('Uservoice', 'Support/Feedback');
  }
});
