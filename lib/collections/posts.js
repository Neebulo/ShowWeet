// Posts collection database
Posts = new Mongo.Collection('posts');
// permissions to allow update/remove if post belongs to owner
Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following fields:
    return (_.without(fieldNames, 'url', 'title', 'description').length > 0);
  }
});

// validation for post edit
Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url || errors.description;
  }
});

// validation post submit
validatePost = function (post) {
  var errors = {};

  if (!post.title)
    errors.title = "Please fill in a headline";


// checks if there is an url or if http:// is not in input field
  //if (!post.url || post.url.slice(0,7) !== 'http://')  ** this is an alternative
  if (!post.url)
    errors.url =  "Please fill in a URL make sure you have either http:// or https://";

  if (!post.description)
    errors.description =  "Please fill in description";

  return errors;
}

// method to insert unique post
// will look for the postAttributes or deny the posting
Meteor.methods({
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      url: String,
      description: String
    });

    //validation
    var errors = validatePost(postAttributes);
    if (errors.title || errors.url || errors.description)
      throw new Meteor.Error('invalid-post', "You must set a title, URL, and description for your post");

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
    //the post will have extended attributes of userId, author, and submit date, commentsCount, upvoters, votes
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });
// inserts the post with user id and post id related
    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  }, //postInsert end
//upvote function
  upvote: function(postId) {
    check(this.userId, String);
    check(postId, String);

    var post = Posts.findOne(postId);
    if (!post)
      throw new Meteor.Error('invalid', 'Post not found');

    if (_.include(post.upvoters, this.userId))
      throw new Meteor.Error('invalid', 'Already upvoted this post');

    Posts.update(post._id, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
  } //upvote end

}); //Meteor Method end

// replaced by post submit method
/*
Posts.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
*/
