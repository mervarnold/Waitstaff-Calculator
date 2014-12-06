'use strict';

angular.module('waitstaffApp', [])
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
	.controller('customerChargesCtrl', function($scope, $rootScope){
		$scope.subtotal = $scope.tip = $scope.total = 0;
		$scope.$on('mealAdded', function(event, basePrice, taxRate, tipPercent){
			$scope.subtotal = basePrice + basePrice * (tipPercent / 100);
			$scope.tip = $scope.subtotal * (tipPercent / 100);
			$scope.total = $scope.subtotal + $scope.tip;
			$rootScope.$broadcast('mealCharged', $scope.tip);
		})
		$scope.$on('hardReset', function() {
			$scope.subtotal = $scope.tip = $scope.total = 0;
		})
	})
	.controller('earningsCtrl', function($scope){
		$scope.mealCount = $scope.tipTotal = $scope.avgTip = 0;
		$scope.$on('mealCharged', function(event, tip){
			$scope.mealCount++;
			$scope.tipTotal += tip;
			$scope.avgTip = $scope.tipTotal / $scope.mealCount;
		})
		$scope.$on('hardReset', function() {
			$scope.mealCount = $scope.tipTotal = $scope.avgTip = 0;
		})
	})
	.controller('resetCtrl', function($scope, $rootScope){
		$scope.reset = function() {
			$rootScope.$broadcast('hardReset');
		}
	});