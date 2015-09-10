// to post on server side
Meteor.publish('posts', function() {
  return Posts.find();
});

//post comments on server side (comment relate to a post)
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

/** refactored for comments publish
Meteor.publish('comments', function() {
  return Comments.find();
})
**/
