(function(){

	'use strict';
	var app = angular.module('postsCtrl', ['ui.router']);

	app.config([
	'$stateProvider',
	function($stateProvider){
		$stateProvider
			.state('posts', {
				url: '/posts/{id}',
				templateUrl: '/templates/posts.html',
				controller: 'PostsCtrl',
				resolve: {
					post: ['$stateParams', 'posts', function($stateParams, posts){
						return posts.get($stateParams.id);
					}]
				}
			})
	}]);

	//Post Controller
	app.controller('PostsCtrl', ['$scope', 'posts', 'post', 'auth', function($scope, posts, post, auth){
			$scope.post = post;
			$scope.isLoggedIn = auth.isLoggedIn;
			$scope.addComment = function(){
				if(!$scope.body || $scope.body === ''){return;}
				posts.addComment(post._id, {
					body: $scope.body,
					author: 'user',
				}).success(function(comment){
					 $scope.post.comments.push(comment);
				});

				$scope.body = '';
			};

			$scope.incrementUpvotes = function(comment){
				posts.upvotesComment(post, comment);
			};

			$scope.decrementDownvotes = function(comment){
				posts.downvotesComment(post, comment);
			};

	}]);


})();