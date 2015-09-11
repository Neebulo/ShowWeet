// display comments on a post helper
Template.postPage.helpers({
  comments: function() {
    return Comments.find({postId: this._id});
  }
});
