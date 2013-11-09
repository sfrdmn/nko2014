var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter

function Planet(game) {
  this.game = game
  //game.addItem(this)
  this.mesh = this.createPlanetMesh()
  this.game.scene.add(this.mesh)
}
inherits(Planet, EventEmitter)

Planet.prototype.tick = function() {
}

Planet.prototype.createPlanetMesh = function() {
  var game = this.game,
      radius = 100,
      segments = 16,
      rings = 16,
      material = new game.THREE.MeshLambertMaterial({color: 0x0000ff})

  return new game.THREE.Mesh(
      new game.THREE.SphereGeometry(radius, segments, rings),
      material)
}

module.exports = Planet
