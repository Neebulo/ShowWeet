// to post on server side
Meteor.publish('posts', function() {
  return Posts.find();
});
//post comments on server side
Meteor.publish('comments', function() {
  return Comments.find();
})
