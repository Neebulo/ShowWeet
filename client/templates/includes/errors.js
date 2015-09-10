Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});
//clear errors after 3 seconds so there is no record in database
Template.error.onRendered(function() {
  var error = this.data;
  Meteor.setTimeout(function () {
    Errors.remove(error._id);
  }, 3000);
});
