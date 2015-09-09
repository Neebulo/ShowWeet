// function that happens at button click of submit post
// creates a new post with a post._id and places it on post_page.html
Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
// post will have an url and title
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };
    //unique post insert to postPage
    Meteor.call('postInsert', post, function(error, result) {
      // display the error to the user and abort
      if (error)
        return alert(error.reason);

        // show this result but route anyway
      if (result.postExists)
        alert('This link has already been posted');

      Router.go('postPage', {_id: result._id});
    });
  }
});



// unique post will be inserted into postPage
// replaced by post submit method (postInsert)

/*
    post._id = Posts.insert(post);
    Router.go('postPage', post);
  }
});
*/
