Template.learn.title = function() {
  return Session.get("currentPost").title;
}

Template.learn.content = function() {
  var converter = new Showdown.converter();
  return converter.makeHtml(Session.get("currentPost").content);
}

Template.learn.prerequisites = function() {
  return Session.get("currentPost").prerequisites;
  return [
    {
      img: 'http://ecx.images-amazon.com/images/I/51NMMLsw6XL._AA160_.jpg',
      title: 'A Raspberry Pi', 
      description: 'Do I really need to explain?'
    },
    {
      img: 'http://www.tbideas.com/blog/img/raspberrypi-meets-led.jpg',
      title: 'High power LED driver'
    },
    {
      img: 'http://www.ledengin.com/site_media/images/Products_Emitters.png',
      title: 'High power RGB led'
    }  
  ];
}