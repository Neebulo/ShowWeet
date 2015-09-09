// function helper to find all posts
Template.postsList.helpers({
  posts: function() {
    //sort by submit timestamp
    return Posts.find({}, {sort: {submitted: -1}});
  }
});
