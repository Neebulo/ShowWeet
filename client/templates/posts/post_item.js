Template.postItem.helpers({
  // helper to allow edit if it is owner's post
  ownPost: function() {
    return this.userId == Meteor.userId();
  },
// the function helper to create a unique url for each post
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  }
});
// event listener for upvote
Template.postItem.events({
  'click .upvote': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});
