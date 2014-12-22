'use strict';

//Gulp ngAnnotate

angular.module('waitstaffApp', ['ngRoute', 'ngAnimate'])
	.config(function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'home.html'
		})
		.when('/my-earnings', {
			templateUrl: 'my-earnings.html'
		})
		.when('/new-meal', {
			templateUrl: 'new-meal.html'
		})
		.otherwise({
			redirectTo: '/'
		});
	})

	.value('mealHistory', {
		mealCount: 0,
		tipTotal: 0
	})

	.controller('mealDetailsCtrl', function($scope, $rootScope) {
		$scope.addMeal = function() {
			if ($scope.enterMeal.$invalid) {
				alert('Fill out the red field(s) with numbers, like 23.22');
				return;
			}
			$rootScope.$broadcast('mealAdded', $scope.basePrice, $scope.taxRate, $scope.tipPercent);
			resetForm();
		}
		function resetForm() {
			$scope.enterMeal.$setPristine();
			$scope.basePrice = $scope.taxRate = $scope.tipPercent = null;
		}
		$scope.$on('hardReset', function() {
			resetForm();
		})
		$scope.cancelMeal = function() {
			resetForm();
		}
	})

	.controller('customerChargesCtrl', function($scope, $rootScope, mealHistory){
		$scope.subtotal = $scope.tip = $scope.total = 0;
		$scope.$on('mealAdded', function(event, basePrice, taxRate, tipPercent){
			$scope.subtotal = basePrice + basePrice * (tipPercent / 100);
			$scope.tip = $scope.subtotal * (tipPercent / 100);
			$scope.total = $scope.subtotal + $scope.tip;
			mealHistory.mealCount++;
			mealHistory.tipTotal += $scope.tip;
		})
		$scope.$on('hardReset', function() {
			$scope.subtotal = $scope.tip = $scope.total = 0;
		})
	})

	.controller('earningsCtrl', function($scope, mealHistory){
		$scope.mealCount = mealHistory.mealCount;
		$scope.tipTotal = mealHistory.tipTotal;
		$scope.avgTip = ($scope.tipTotal / $scope.mealCount) || 0;

		$scope.$on('hardReset', function() {
			$scope.mealCount = $scope.tipTotal = $scope.avgTip = 0;
			mealHistory.tipTotal = mealHistory.mealCount = 0;
		})
	})

	.controller('resetCtrl', function($scope, $rootScope){
		$scope.reset = function() {
			$rootScope.$broadcast('hardReset');
		}
	});



