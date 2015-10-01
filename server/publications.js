// to post on server side

Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});
/* refactor for Augment
Meteor.publish('posts', function() {
  return Posts.find();
});
*/
// added for single post subscription
Meteor.publish('singlePost', function(id) {
  check(id, String);
  return Posts.find(id);
});

//post comments on server side (comment relate to a post)
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

//post notifications server side
Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});

/** refactored for comments publish
Meteor.publish('comments', function() {
  return Comments.find();
})
**/
