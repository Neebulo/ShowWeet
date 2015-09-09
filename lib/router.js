// router setup for each template
Router.configure({
  layoutTemplate: 'layout',
  // added for spin load icon
  loadingTemplate: 'loading',
  //added for 'not found' page
  notFoundTemplate: 'notFound',
    waitOn: function() { return Meteor.subscribe('posts'); }
  });

// route to show all posts_list.html
Router.route('/', {name: 'postsList'});

// route for single post_page.html
Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { return Posts.findOne(this.params._id); }
});

// route for edit and delete
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});

//route for post submit after submit post button click
Router.route('/submit', {name: 'postSubmit'});


// route for 'not found' page
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
