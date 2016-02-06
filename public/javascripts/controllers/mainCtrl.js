(function(){
	 'use strict';
	var app = angular.module('mainCtrl', ['ui.router']);

	app.config([
	'$stateProvider',
	function($stateProvider){
		$stateProvider
			.state('home', {
			url: '/home', 
			templateUrl: '/templates/home.html', 
			controller: 'MainCtrl',
			resolve: {
				postPromise: ['posts', function(posts){
					return posts.getAll();
				}]
			  }
		})
	}]);


	//Main Controlller
	app.controller('MainCtrl', ['$scope', 'posts', 'auth', function($scope, posts, auth){
		$scope.posts = posts.posts;
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.addPost = function(){
			if(!$scope.title || $scope.title === ''){return;}
			posts.create({
				title: $scope.title,
				link: $scope.link,
				description: $scope.description,
			});
			$scope.title = '';
			$scope.link = '';
			$scope.description = '';
			
		};

		$scope.incrementUpvotes = function(post){
			posts.upvote(post);
		};

		$scope.decrementDownvotes = function(post){
			posts.downvote(post);
		};

	}]);

})();