var app = angular.module('ArcheryScore', ['ionic']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider.
    state('home', {
			url: '/matches',
      templateUrl: 'templates/matches.html',
      controller: 'MatchesCtrl'
    }).
    state('edit', {
			url: '/match/setup/:id',
      templateUrl: 'templates/match_settings.html',
      controller: 'SetupCtrl'
    }).
    state('new', {
			url: '/match/setup',
      templateUrl: 'templates/match_settings.html',
      controller: 'SetupCtrl'
    }).
		state('view', {
			url: '/match/:id',
			templateUrl: 'templates/match.html',
			controller: 'MatchCtrl'
		});
  $urlRouterProvider.otherwise("/matches");
	//$locationProvider.html5Mode(true);
});

app.controller('MatchesCtrl', ['$scope', 'MatchFactory', function($scope, MatchFactory) {
	$scope.matches = MatchFactory.getMatches();
}]);

app.controller('SetupCtrl', ['$scope', 'MatchFactory', '$stateParams', '$location', function($scope, MatchFactory, $stateParams, $location) {
	if($stateParams.id) {
		$scope.match = MatchFactory.getMatch($stateParams.id);
	} else {
		$scope.match = MatchFactory.newMatch();
		$scope.new = true;
	}
	
	$scope.save = function() {
		MatchFactory.setMatch($scope.match);
		$location.url('/match/'+$scope.match.id);
	};
	
	$scope.addArcher = function() {
		$scope.match.archers.push(MatchFactory.newArcher());
	};
	
	$scope.deleteMatch = function() {
		var c = confirm("Are you sure?");
		if(c) {
			MatchFactory.deleteMatch($scope.match);
			$location.url('/matches');
		}
	};
}]);

app.controller('MatchCtrl', ['$scope', 'MatchFactory', '$stateParams', '$location', '$ionicSideMenuDelegate', function($scope, MatchFactory, $stateParams, $location, $ionicSideMenuDelegate){
	$scope.match = MatchFactory.getMatch($stateParams.id);
	$scope.archerIndex = 0;
	$scope.shots = '';
	if($scope.match == undefined) {
		$location.url('/matches');
	}
	
	$scope.addSet = function(shots) {
		var points = _.chain(shots.split(/[,\s]/))
			.pull("")
			.map(function(shot) { return parseInt(shot, 10); } )
			.sort().reverse().value();
		var total = 0;
		_.forEach(points, function(shot) {
			total += shot;
		});
		$scope.match.archers[$scope.archerIndex].total += total;
		$scope.match.archers[$scope.archerIndex].sets.push({shots: points, total: total});
		$scope.shots = '';
		MatchFactory.setMatch($scope.match);
	};
	
	$scope.deleteSet = function(index) {
		var c = confirm("Are you sure?");
		if(c) {
			$scope.match.archers[$scope.archerIndex].total -= $scope.match.archers[$scope.archerIndex].sets[index].total;
			$scope.match.archers[$scope.archerIndex].sets.splice(index,1);
			MatchFactory.setMatch($scope.match);
		}
	};
	
	$scope.switchArcher = function(destination) {
		switch(destination) {
			case 'next':
				$scope.archerIndex = ($scope.archerIndex < $scope.match.archers.length-1) ? $scope.archerIndex + 1 : $schope.archerIndex;
				$ionicSideMenuDelegate.toggleLeft();
				break;
			case 'previous': 
				$scope.archerIndex = ($scope.archerIndex > 0) ? $scope.archerIndex - 1 : 0;
				$ionicSideMenuDelegate.toggleLeft();
				break;
			default: 
				var tmpIndex = _.findIndex($scope.match.archers, function(archer) {
					return archer.name === destination;
				});
				if(tmpIndex >= 0) {
					$scope.archerIndex = tmpIndex;
					$ionicSideMenuDelegate.toggleLeft();
				};
				break;
		}
	};
}]);

app.factory('MatchFactory', function() {
	var obj = {};
	var matches = JSON.parse(localStorage.getItem('ArcheryScore')) || {};
	var save = function() {
		localStorage.setItem('ArcheryScore', JSON.stringify(matches));
	}
	
	obj.getMatches = function() {
		return matches;
	};
	obj.getMatch = function(id) {
		return matches[id];
	};
	obj.setMatch = function(match) {
		matches[match.id] = match;
		save();
	};
	obj.deleteMatch = function(match) {
		delete matches[match.id];
		save();
	}
	obj.newMatch = function() {
		var date = new Date()
		return {
			id: date.getTime().toString(16).toUpperCase(),
			date: moment().format('l H:mm'),
			archers: [
				{
					name: "Archer name",
					total: 0,
					sets: []
				}
			]
		};
	};
	obj.newArcher = function(archerName) {
		archerName = archerName || 'Archer name';
		return {
			name: archerName,
			total: 0,
			sets: []
		};
	};
	
	return obj;
});