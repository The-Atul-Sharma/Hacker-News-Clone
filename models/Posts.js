var mongoose = require('mongoose');

//Post Schema
var PostSchema = new mongoose.Schema({
	title: String,
	link: String,
	description: String,
	upvotes: {type: Number, default: 0},
	downvotes: {type: Number, default: 0},
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

//Upvotes Method
PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

//Downvote Method
PostSchema.methods.downvote = function(cb){
	this.downvotes += 1;
	this.save(cb);
}

mongoose.model('Post', PostSchema);