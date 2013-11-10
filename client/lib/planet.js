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
      THREE = game.THREE,
      radius = 10,
      segments = 16,
      rings = 16,
      texture = THREE.ImageUtils.loadTexture('images/rock.jpg'),
      // material = THREE.MeshPhongMaterial({
      //   map: texture,
      //   bumpMap: texture
      // })
      material = new THREE.MeshLambertMaterial({
        map: texture,
        color: 0x0000ff
      })
  return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, rings),
      material)
}

module.exports = Planet
