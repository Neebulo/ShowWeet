// Posts collection database
Posts = new Mongo.Collection('posts');
// method to insert unique post
Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });
    // relates post to user
    var user = Meteor.user();
    //the post will have extended attributes of userId, author, and submit date
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
// inserts the post with user id and post id related
    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  }
});

// replaced by post submit method
/*
Posts.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
*/
