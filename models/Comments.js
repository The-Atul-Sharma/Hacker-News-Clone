var mongoose = require('mongoose');

//Comment Schema
var CommentSchema = new mongoose.Schema({
	body: String,
  	author: String,
  	upvotes: {type: Number, default: 0},
  	downvotes: {type: Number, default: 0},
  	post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

//Upvote Comment
CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

//Downvote Comment
CommentSchema.methods.downvote = function(cb) {
  this.downvotes += 1;
  this.save(cb);
};

mongoose.model('Comment', CommentSchema);