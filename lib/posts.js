Posts = new Meteor.Collection("posts")

createNewPosts = function() {
  return {
    title: '',
    summary: '',
    img: '',
    link: '',
    content: ''
  }
}