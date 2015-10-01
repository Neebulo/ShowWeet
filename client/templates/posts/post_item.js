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
  },
  //disable upvote if not logged in or already voted
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  } //upvotedClass end
}); //helpers end
// event listener for upvote
Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});
