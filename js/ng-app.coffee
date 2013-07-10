ArcherCtrl = ($scope)->
  $scope.archers = [
    { name: 'ArcherA', sets: [], total: 0},
    { name: 'ArcherB', sets: [], total: 0},
    { name: 'ArcherC', sets: [], total: 0},
    { name: 'ArcherD', sets: [], total: 0},
    { name: 'ArcherE', sets: [], total: 0}
  ]

  $scope.activeArcher = ''
  $scope.new_set_values = ''

  $scope.countShots = (set) ->
    total = 0
    set.forEach (shot)->
      total += parseInt(shot,10)
    return total

  $scope.updateActiveArcher = (archerName) ->
    $scope.activeArcher = archerName
    console.log "updating active archer: " + archerName
    console.log "now set to: " + $scope.activeArcher

  $scope.addSet = () ->
    if $scope.activeArcher == ''
      alert "Please select archer first"
    $scope.archers.forEach (archer)->
      console.log 'testing: ' + archer.name
      if archer.name == $scope.activeArcher
        console.log("found him")
        console.log "Adding set: " + $scope.new_set_values
        new_set = $scope.new_set_values.split(' ')
        archer.sets.push new_set
        console.log archer.sets
        new_set.forEach (shot)->
          archer.total += parseInt shot,10

