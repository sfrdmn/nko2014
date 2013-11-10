var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter

var DebugDot = require('./debug-dot.js')

function Beam(game) {
  this.game = game
  THREE = game.THREE
  this.init()
  // game.addItem(this)
}
inherits(Beam, EventEmitter)

Beam.prototype.init = function() {
  var THREE = this.game.THREE
  var geometry = new THREE.Geometry()
  var vert1 = new THREE.Vector3()
  var vert2 = new THREE.Vector3(0, 1, 5)
  geometry.vertices.push(vert1)
  geometry.vertices.push(vert2)
  var material = new THREE.LineBasicMaterial({
    color: 0x0000ff,
    opacity: 0.5,
    linewidth: 1
  })
  var line = this.line = new THREE.Line(geometry, material, THREE.LinePieces)
  line.scale.multiplyScalar(1e4)
  line.updateMatrix()
  this.game.scene.add(line)
  this.game.on('tick', this.tick.bind(this))
}

Beam.prototype.tick = function() {
  var THREE = this.game.THREE
  var camera = this.game.camera
  var quat = new THREE.Quaternion()
  var position = camera.position.clone().negate()
  this.line.lookAt(position)
  // this.debug.object.position.copy(position)
  // this.debug.object.updateMatrix()
  // this.line.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI)
  // this.line.rotation.negate()
  // this.line.useQuaternion = true
  // this.line.quaternion = camera.quaternion
  // this.line.rotation.y += 1
  //this.line.rotation.normalize()
  //this.line.rotation.applyQuaternion(camera.quaternion)
  //var up = camera.up.clone().negate()
  // var up = camera.up.clone()
  // var position = camera.position.clone().negate()
  // m.lookAt(new THREE.Vector4(), position, up)
  // this.line.quaternion.setFromRotationMatrix(m)
  // quat.setFromRotationMatrix(m)
  // this.line.rotation = new THREE.Vector3()
  // this.line.rotation.applyQuaternion(quat)
  // this.line.rotation.applyMatrix3(camera.matrixWorldInverse)
  this.line.updateMatrix()
}

module.exports = Beam
