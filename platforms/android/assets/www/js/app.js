var app = angular.module('ArcheryScore', ['ngRoute','ionic']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
      when('/matches', {
        templateUrl: '/templates/matches.html',
        controller: 'MatchesCtrl'
      }).
      when('/match/setup/:id', {
        templateUrl: '/templates/match_settings.html',
        controller: 'SetupCtrl'
      }).
      when('/match/setup', {
        templateUrl: '/templates/match_settings.html',
        controller: 'SetupCtrl'
      }).
			when('/match/:id', {
				templateUrl: '/templates/match.html',
				controller: 'MatchCtrl'
			}).
      otherwise({
        redirectTo: '/matches'
      });
}]);

app.controller('MatchesCtrl', ['$scope', 'MatchFactory', function($scope, MatchFactory) {
	$scope.matches = MatchFactory.getMatches();
}]);

app.controller('SetupCtrl', ['$scope', 'MatchFactory', '$routeParams', '$location', function($scope, MatchFactory, $routeParams, $location) {
	if($routeParams.id) {
		$scope.match = MatchFactory.getMatch($routeParams.id);
	} else {
		$scope.match = MatchFactory.newMatch();
	}
	
	$scope.save = function() {
		MatchFactory.setMatch($scope.match);
		$location.url('/match/'+$scope.match.id);
	};
	
	$scope.addArcher = function() {
		$scope.match.archers.push({name: 'Archer name'});
	};
}]);

app.controller('MatchCtrl', ['$scope', 'MatchFactory', '$routeParams', '$location', function($scope, MatchFactory, $routeParams, $location){
	$scope.match = MatchFactory.getMatch($routeParams.id);
	if($scope.match == undefined) {
		$location.url('/matches');
	}
	$scope.archerIndex = 0;
	
	$scope.addSet = function(shots) {
		var points = _.chain(shots.split(/[,\s]/))
			.pull("")
			.map(function(shot) { return parseInt(shot, 10); } )
			.sort().reverse().value();
		console.log(points);
		var total = 0;
		_.forEach(points, function(shot) {
			total += shot;
		});
		$scope.match.archers[$scope.archerIndex].total += total;
		$scope.match.archers[$scope.archerIndex].sets.push({shots: points, total: total});
		$scope.shots = '';
		MatchFactory.setMatch($scope.match);
	};
	
	$scope.switchArcher = function(destination) {
		switch(destination) {
			case 'next':
				$scope.archerIndex = ($scope.archerIndex < $scope.match.archers.length-1) ? $scope.archerIndex + 1 : $schope.archerIndex;
				break;
			case 'previous': 
				$scope.archerIndex = ($scope.archerIndex > 0) ? $scope.archerIndex - 1 : 0;
				break;
			default: 
				var tmpIndex = _.findIndex($scope.match.archers, function(archer) {
					return archer.name === destination;
				});
				if(tmpIndex >= 0) {
					$scope.archerIndex = tmpIndex;
				};
				break;
		}
	};
}]);

app.factory('MatchFactory', function() {
	var obj = {};
	obj.matches = JSON.parse(localStorage.getItem('ArcheryScore')) || {};
	
	obj.getMatches = function() {
		return this.matches;
	};
	obj.getMatch = function(id) {
		return this.matches[id];
	};
	obj.setMatch = function(match) {
		this.matches[match.id] = match;
		localStorage.setItem('ArcheryScore', JSON.stringify(this.matches));
	};
	obj.newMatch = function(archerName) {
		archerName = archerName || 'Archer name';
		return {
			id: new Date().getTime().toString(16).toUpperCase(),
			date: new Date().getTime(),
			archers: [
				{
					name: archerName,
					total: 0,
					sets: []
				}
			]
		};
	};
	
	return obj;
});