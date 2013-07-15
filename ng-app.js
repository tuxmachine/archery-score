var ArcherCtrl = function($scope) {

  var archer_factory = function(spec) {
    var that = {};
    spec = spec || {name: 'ArcherA', total: 0, sets: [{shots: [], total: 0]};

    that.get_name = function() {
      return spec.name;
    };
    that.get_sets = function() {
      return spec.sets;
    };

    that.add_shot = function(value) {
      if(typeof value === 'number') {
        spec.sets.at(-1).shots.push(value);
        spec.sets.at(-1).total += value;
        spec.total += value
      }
      return this;
    }

    that.set_name = function(name) {
      if(typeof name === 'string') {
        spec.name = name;
      }
      return this;
    };

    that.close_set = function() {
      spec.sets.push({shots: [], total: 0});
      return this;
    };

    that.average_set = function() {
      return (spec.total / spec.sets.length).round(1)
    };

    return that;
  };

  $scope.archers = [archer_factory()];
  $scope.active_archer = $scope.archers[0];
  $scope.menu_status = '';

  $scope.toggle_menu = function() {
    if ($scope.menu_status === '') {
      return $scope.menu_status = 'open';
    } else {
      return $scope.menu_status = '';
    }
  };
  $scope.update_active_archer = function(archer_index) {
    $scope.active_archer = $scope.archers[archer_index];
    console.log("archer set to: " + $scope.active_archer.get_name());
    return $scope.menu_status = '';
  };

  $scope.new_archer = function() {
    var name = prompt("Name of archer?");
    $scope.archers.push(archer_factory( ).set_name(name));
    return console.log("added new archer: " + name);
  };

  $scope.add_shot = function(value) {
    return $scope.active_archer.add_shot(value);
  };

  $scope.close_set = function() {
    return $scope.active_archer.close_set();
  };

  return $scope.rename = function() {
    return $scope.active_archer.set_name(prompt("Enter new name"));
  };
};
