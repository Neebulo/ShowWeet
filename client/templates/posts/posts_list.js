// function helper to find all posts
Template.postsList.helpers({
  posts: function() {
    return Posts.find();
  }
});
