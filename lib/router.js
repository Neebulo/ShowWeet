Router.configure({
  layoutTemplate: 'layout',
  // added for spin load icon
  loadingTemplate: 'loading',
    waitOn: function() { return Meteor.subscribe('posts'); }
  });

Router.route('/', {name: 'postsList'});

// route for single post_page.html
Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { return Posts.findOne(this.params._id); }
});
