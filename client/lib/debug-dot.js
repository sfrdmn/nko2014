var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter

function DebugDot(game) {
  var THREE = game.THREE,
      radius = 1,
      segments = 4,
      rings = 4,
      material = new THREE.MeshLambertMaterial({color: 0xff0000})
  this.game = game
  this.object = new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, rings),
      material)
  game.scene.add(this.object)
}
inherits(DebugDot, EventEmitter)

module.exports = DebugDot
