// Posts collection database
Posts = new Mongo.Collection('posts');
// permissions to allow update/remove if post belongs to owner
Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

// method to insert unique post
Meteor.methods({
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      url: String
    });

    // enforce unique url
    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

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
