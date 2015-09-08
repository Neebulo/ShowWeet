// to post on server side
Meteor.publish('posts', function() {
  return Posts.find();
});
