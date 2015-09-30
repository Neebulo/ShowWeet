// router setup for each template
Router.configure({
  layoutTemplate: 'layout',
  // added for spin load icon
  loadingTemplate: 'loading',
  //added for 'not found' page
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('notifications')]
    /* for Augmented refactor
    //return [Meteor.subscribe('posts'), Meteor.subscribe('notifications')]
    */
  }
});
  /** refactored for comments subscribe
  waitOn: function() {
  return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];
}
});
**/

// route to show all posts_list.html
/* Augmented for refactor
// Router.route('/', {name: 'postsList'});
*/

// route for single post_page.html
Router.route('/posts/:_id', {
  name: 'postPage',
  //comments subscribe (relates a comment to a post)
  waitOn: function() {
    return Meteor.subscribe('comments', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

// route for edit and delete
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});

//route for post submit after submit post button click
Router.route('/submit', {name: 'postSubmit'});
// For Augmented
Router.route('/:postsLimit?', {
  name: 'postsList',
  waitOn: function() {
    var limit = parseInt(this.params.postsLimit) || 5;
    return Meteor.subscribe('posts', {sort: {submitted: -1}, limit: limit});
  },
  data: function() {
    var limit = parseInt(this.params.postsLimit) || 5;
    return {
      posts: Posts.find({}, {sort: {submitted: -1}, limit: limit})
    };
  }
});
// require login or access is denied
var requireLogin = function() {
  if (! Meteor.user()) {
    this.render('accessDenied');
  } else {
    this.next();
  }
}


// route for 'not found' page
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
// allow post submit only at login
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
