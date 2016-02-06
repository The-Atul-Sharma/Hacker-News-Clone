(function(){

	'use strict';
	var app = angular.module('authCtrl', ['ui.router']);

	app.config([
	'$stateProvider',
	function($stateProvider){
		$stateProvider
			.state('login', {
					url: '/login',
				  	templateUrl: '/templates/login.html',
				  	controller: 'AuthCtrl',
				  	onEnter: ['$state', 'auth', function($state, auth){
				    	if(auth.isLoggedIn()){
				      	$state.go('home');
				    	}
				  	}]
				})
				.state('register', {
	 				url: '/register',
	 				templateUrl: '/templates/register.html',
	  				controller: 'AuthCtrl',
	  				onEnter: ['$state', 'auth', function($state, auth){
	    				if(auth.isLoggedIn()){
	      					$state.go('home');
	    				}
	  				}]
				})
	}]);

	//Authenticate Controller
	app.controller('AuthCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth){
		$scope.user = {};

	  	$scope.register = function(){
	   		auth.register($scope.user).error(function(error){
	      		$scope.error = error;
	    	}).then(function(){
	      	$state.go('home');
	    	});
	  	};

	  	$scope.logIn = function(){
	    	auth.logIn($scope.user).error(function(error){
	      		$scope.error = error;
	    	}).then(function(){
	      		$state.go('home');
	    	});
	  	};
	}]);

})();