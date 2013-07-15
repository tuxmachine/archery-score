ArcherCtrl = ($scope)->
  archer_factory = (spec)->
    that = {}
    spec = spec || { name: 'Archer', total: 0, sets: [{shots: [], total: 0}]}

    that.get_name = ()->
      return spec.name
    that.get_sets = ()->
      return spec.sets
    that.get_total = ()->
      return spec.total
    that.get_average = ()->
      return (spec.total / spec.sets.length).round(1)
    that.add_shot = (value)->
      if typeof value == 'number'
        spec.sets.at(-1).shots.push(value)
        spec.sets.at(-1).total += value
        spec.total += value
      return this
    that.set_name = (name)->
      if typeof name == 'string'
        spec.name = name
      return this
    that.close_set = ()->
      spec.sets.push({shots: [], total: 0})
      return this
    return that

  $scope.archers = [archer_factory()]

  $scope.active_archer = $scope.archers[0]

  $scope.menu_status = ''

  $scope.toggle_menu = () ->
    if $scope.menu_status == ''
      $scope.menu_status = 'open'
    else
      $scope.menu_status = ''

  $scope.update_active_archer = (archer_index) ->
    $scope.active_archer = $scope.archers[archer_index]
    console.log "archer set to: " + $scope.active_archer.name
    $scope.menu_status = ''

  $scope.new_archer = ()->
    name = prompt("Name of archer?")
    $scope.archers.push(archer_factory().set_name(name))
    console.log "added new archer: "+name

  $scope.add_shot = (value)->
    $scope.active_archer.add_shot(value)

  $scope.close_set = ()->
    $scope.active_archer.close_set()

  $scope.rename = ()->
    $scope.active_archer.set_name(prompt "Enter new name")

  $scope.reset = ()->
    $scope.archers = [archer_factory()]
