class Set
  this.shots
  this.total

  constructor: ()->
    this.shots = []
    this.total = 0

class Archer
  this.sets
  this.total
  this.averageSet
  this.name
  currentSet = new Set()

  constructor: (_name='')->
    this.name = _name
    this.sets = [new Set()]
    this.total = 0
    this.averageSet = 0
    currentSet = this.sets[this.sets.length - 1]

  addShot: (value)->
    console.log "adding "+ value
    currentSet.shots.push value
    currentSet.total += value
    this.total += value

  finishSet: ()->
    this.sets.push new Set()
    currentSet = this.sets[this.sets.length - 1]
    this.averageSet = (this.total / (this.sets.length - 1)).toFixed(1)

ArcherCtrl = ($scope)->
  $scope.archers = [new Archer('ArcherA')]

  $scope.activeArcher = $scope.archers[0]

  $scope.menuStatus = ''

  $scope.toggleMenu = () ->
    if $scope.menuStatus == ''
      $scope.menuStatus = 'open'
    else
      $scope.menuStatus = ''

  $scope.updateActiveArcher = (archerIndex) ->
    $scope.activeArcher = $scope.archers[archerIndex]
    console.log "archer set to: " + $scope.activeArcher.name
    $scope.menuStatus = ''

  $scope.newArcher = ()->
    name = prompt("Name of archer?")
    $scope.archers.push(new Archer(name))
    console.log "added new archer: "+name

  $scope.addShot = (value)->
    $scope.activeArcher.addShot(value)

  $scope.finishSet = ()->
    $scope.activeArcher.finishSet()

  $scope.rename = ()->
    $scope.activeArcher.name = prompt "Enter new name"
