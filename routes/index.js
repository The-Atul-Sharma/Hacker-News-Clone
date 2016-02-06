var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var Post = mongoose.model('Post');			//Load Post Model
var Comment = mongoose.model('Comment');	//Load Comment Model
var User = mongoose.model('User');			//Load User Model
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


//Get All Post
router.get('/posts', function(req, res, next){
	Post.find(function(err, posts){
		if(err){return next(err);}

		res.json(posts);
	});
});


//Create New Post
router.post('/posts', auth, function(req, res, next){
	var post = new Post(req.body);

	post.author = req.payload.username;

	post.save(function(err, post){
		if(err){return next(err);}

		res.json(post);
	});
});


//Map logic to route parameter 'post'
router.param('post', function(req, res, next, id){
	
	var query = Post.findById(id);

	query.exec(function(err, post){
		if(err){return next(err);}
		if(!post){return next(new Error('can\'t find post')); }

		req.post = post;
		return next();
	});
});


//Create Route For Return A Single Post
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});


//Route For Upvote A Post
router.put('/posts/:post/upvote', auth, function(req, res, next){
	req.post.upvote(function(err, post){
		if(err){return next(err);}

		res.json(post);
	});
});

//Route For Dwonvote A Post
router.put('/posts/:post/downvote', auth, function(req, res, next){
	req.post.downvote(function(err, post){
		if(err){return next(err);}

		res.json(post);
	});
});

//Route For A Comment
router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});


//Get A Comment
router.get('/posts/:post/comments', function(req, res, next){
	Comment.find(function(err, comments){
		if(err){return next(err);}

		res.json(comments);
	});
});


//Route For A Comment Upvote
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next){
	req.comment.upvote(function(err, comment){
		if(err){return next(err);}

		res.json(comment);
	});
});

//Route For A Comment Upvote
router.put('/posts/:post/comments/:comment/downvote', auth, function(req, res, next){
	req.comment.downvote(function(err, comment){
		if(err){return next(err);}

		res.json(comment);
	});
});


//Map logic to route parameter 'comment'
router.param('comment', function(req, res, next, id){
	
	var query = Comment.findById(id);

	query.exec(function(err, comment){
		if(err){return next(err);}
		if(!comment){return next(new Error('can\'t find post')); }

		req.comment = comment;
		return next();
	});
});


//Route For Register A User
router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});


//Route For Login A User
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});



module.exports = router;
