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
//RouterController refactor for postsList
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  /* removed for pagination spinner
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
 */
  },

// step through posts
  posts: function() {
    return Posts.find({}, this.findOptions());
  },

  data: function() {
    var self = this;

    return {
      posts: self.posts(),
      ready: self.postsSub.ready,
      // refactor for load more pagination spinner
      nextPath: function() {
        if (self.posts().count() === self.postsLimit())
          return self.nextPath();
      } //nextPath end
    };
  } //data end
}); //PostsListController end
// Controllers and routes for new and Most Voted
NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});

Router.route('/best/:postsLimit?', {name: 'bestPosts'});

// route for single post_page.html
Router.route('/posts/:_id', {
  name: 'postPage',
  //comments subscribe (relates a comment to a post)
  waitOn: function() {
    /* removed for single post subscription
    return Meteor.subscribe('comments', this.params._id);
    */
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

// route for edit and delete
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  //added for single post subscription
  waitOn: function() {
      return Meteor.subscribe('singlePost', this.params._id);
    },

  data: function() { return Posts.findOne(this.params._id); }
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
