Router.configure({
  layoutTemplate: 'layout'
  // added for spin load icon
  loadingTemplate: 'loading',
    waitOn: function() { return Meteor.subscribe('posts'); }
  });

Router.route('/', {name: 'postsList'});
