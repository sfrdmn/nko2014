// https://github.com/maxogden/voxel-engine

var tic = require('tic')()
var requestAnimationFrame = require('raf')
var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
// var glMatrix = require('gl-matrix')
// var vector = glMatrix.vec3
var THREE = require('three')
require('./orbit-controls.js')(THREE)
require('./particle-system-material.js')(THREE)

//var ResourceLoader = require('./resource-loader.js')
var GameAudio = require('./game-audio.js')
var View = require('./view.js')
var Planet = require('./planet.js')
var Stars = require('./stars.js')

function Game(opts) {
  opts = opts || {}
  this.THREE = THREE
  this.view = new View(THREE, {
    position: new THREE.Vector3(0, 1000, 1000)
  })
  this.scene = new THREE.Scene()
  this.view.bindToScene(this.scene)
  this.camera = this.view.getCamera()
  this.timer = this.initializeTimer((opts.tickFPS || 16))
  this.paused = false
  this.controls = new THREE.OrbitControls(this.camera)
  // so it works with voxel-audio
  this.controls.velocity = new THREE.Vector3(0, 0, 0)
  this.items = []
  this.initializeRendering(opts)

  var ambientlight = new THREE.AmbientLight(0x00ffff)
  this.scene.add(ambientlight)
  this.audio = new GameAudio(this)
  this.planet = new Planet(this)
  this.stars = new Stars(this)

  this.scene.add(new THREE.GridHelper(this.width, this.width))
  this.scene.add(new THREE.AxisHelper(this.width))

  // this.loader = new ResourceLoader()
  // this.audio = new GameAudio(this.loader)
  // this.loader.on('load', this.onLoaded.bind(this))
}
inherits(Game, EventEmitter)

Game.prototype.tick = function(delta) {
  for(var i = 0, len = this.items.length; i < len; ++i) {
    this.items[i].tick(delta)
  }

  // if (this.materials) this.materials.tick(delta)
  this.controls.update()
  tic.tick(delta)

  this.emit('tick', delta)

  // if (!this.controls) return
  // var playerPos = this.playerPosition()
  // this.spatial.emit('position', playerPos, playerPos)
}

Game.prototype.addItem = function(item) {
  if (items.tick) {
    this.items.push(item)
    return this.items[this.items.length - 1]
  }
}

Game.prototype.render = function(delta) {
  this.view.render(this.scene)
}

Game.prototype.cameraPosition = function() {
  return this.view.cameraPosition()
}

Game.prototype.cameraVector = function() {
  return this.view.cameraVector()
}

Game.prototype.initializeTimer = function(rate) {
  var self = this
  var accum = 0
  var now = 0
  var last = null
  var dt = 0
  var wholeTick

  self.frameUpdated = true
  self.interval = setInterval(timer, 0)
  return self.interval

  function timer() {
    if (self.paused) {
      last = Date.now()
      accum = 0
      return
    }
    now = Date.now()
    dt = now - (last || now)
    last = now
    accum += dt
    if (accum < rate) return
    wholeTick = ((accum / rate)|0)
    if (wholeTick <= 0) return
    wholeTick *= rate

    self.tick(wholeTick)
    accum -= wholeTick

    self.frameUpdated = true
  }
}

Game.prototype.initializeRendering = function(opts) {
  var self = this

  //if (!opts.statsDisabled) self.addStats()

  window.addEventListener('resize', self.onWindowResize.bind(self), false)

  requestAnimationFrame(window).on('data', function(dt) {
    self.emit('prerender', dt)
    self.render(dt)
    self.emit('postrender', dt)
  })
  // if (typeof stats !== 'undefined') {
  //   self.on('postrender', function() {
  //     stats.update()
  //   })
  // }
}

Game.prototype.onWindowResize = function() {
  var width = window.innerWidth
  var height = window.innerHeight
  if (this.container) {
    width = this.container.clientWidth
    height = this.container.clientHeight
  }
  this.view.resizeWindow(width, height)
}

Game.prototype.appendTo = function (element) {
  this.view.appendTo(element)
}

Game.prototype.destroy = function() {
  clearInterval(this.timer)
}

module.exports = Game
