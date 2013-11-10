// https://github.com/maxogden/voxel-engine

var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
var tic = require('tic')()
var requestAnimationFrame = require('raf')
var Stats = require('./stats.js')
var THREE = require('three')
var TWEEN = require('tween.js')
require('./orbit-controls.js')(THREE)
require('./particle-system-material.js')(THREE)

var GameAudio = require('./game-audio.js')
var View = require('./view.js')
var Planet = require('./planet.js')
var Stars = require('./stars.js')
// var Beam = require('./beam.js')
var NoticeView = require('./notice-view')

// Will convert sha sum into unique universal position
// This defines the magnitude? of the coordinate space
var UPOS_MAGNITUDE = 4
// Animation FPS
var FPS = 24

function Game(opts) {
  opts = opts || {}
  opts.statsDisabled = true
  this.id = opts.id
  this.THREE = THREE
  this.view = new View(THREE, {
    position: new THREE.Vector3(0, 1000, 1000000)
  })
  this.scene = new THREE.Scene()
  this.view.bindToScene(this.scene)
  this.camera = this.view.getCamera()
  this.timer = this.initializeTimer((opts.tickFPS || 16))
  this.tic = tic
  this.paused = false
  this.controls = new THREE.OrbitControls(this.camera)
  // so it works with voxel-audio
  this.controls.velocity = new THREE.Vector3(0, 0, 0)
  this.controls.enabled = false
  this.items = []
  this.initializeRendering(opts)

  // Calculate a universal position from id
  this.initUPos()

  // Only update tween once a millisecond
  // tic.interval(this.updateTween.bind(this), (1 / FPS) * 1000)

  // var ambientlight = new THREE.AmbientLight(0x00ffff)
  // this.scene.add(ambientlight)
  var hemiLight = new THREE.HemisphereLight(0xffffff, 0.3)
  this.scene.add(hemiLight)
  this.audio = new GameAudio(this)
  this.planet = new Planet(this)
  this.stars = new Stars(this)
  // this.beam = new Beam(this)

  this.scene.add(new THREE.GridHelper(this.width * 1e6, this.width * 1e6))
  this.scene.add(new THREE.AxisHelper(this.width * 1e6))
  // this.scene.add(new THREE.CameraHelper(this.camera))

  // this.loader = new ResourceLoader()
  // this.audio = new GameAudio(this.loader)
  // this.loader.on('load', this.onLoaded.bind(this))
  //this.zoomAnimation()
  this.startAnimation()
}
inherits(Game, EventEmitter)

Game.prototype.startGame = function() {
  this.rotateTween.stop()
  this.audio.get('tronfinal').fadeOut(5000)
  this.zoomAnimation(function() {
    this.controls.enabled = true
    this.notice = new NoticeView()
  }.bind(this))
}

Game.prototype.startAnimation = function() {
  var self = this
  var cameraPos = this.camera.position
  var radius = this.radius = cameraPos.z
  var time = 1000 * 30;
  var rotate1 = this.rotateTween = new TWEEN.Tween({x: 0, z: radius})
    .to({ x: -radius, z: 0}, time)
    .onComplete(function() {
      this.x = 0
      this.z = radius
    })
    .onUpdate(function() {
      self.camera.position.setX(this.x)
      self.camera.position.setZ(this.z)
      self.camera.lookAt(new THREE.Vector3(0, 0, 0))
    })
  var rotate2 = new TWEEN.Tween({x: -radius, z: 0})
    .to({ x: 0, z: -radius}, time)
    .onComplete(function() {
      this.x = -radius
      this.z = 0
    })
    .onUpdate(function() {
      self.camera.position.setX(this.x)
      self.camera.position.setZ(this.z)
      self.camera.lookAt(new THREE.Vector3(0, 0, 0))
    })
  var rotate3 = new TWEEN.Tween({x: 0, z: -radius})
    .to({ x: radius, z: 0}, time)
    .onComplete(function() {
      this.x = 0
      this.z = -radius
    })
    .onUpdate(function() {
      self.camera.position.setX(this.x)
      self.camera.position.setZ(this.z)
      self.camera.lookAt(new THREE.Vector3(0, 0, 0))
    })
  var rotate4 = new TWEEN.Tween({x: radius, z: 0})
    .to({ x: 0, z: radius}, time)
    .onComplete(function() {
      this.x = radius
      this.z = 0
    })
    .onUpdate(function() {
      self.camera.position.setX(this.x)
      self.camera.position.setZ(this.z)
      self.camera.lookAt(new THREE.Vector3(0, 0, 0))
    })
    rotate1.chain(rotate2)
    rotate2.chain(rotate3)
    rotate3.chain(rotate4)
    // rotate4.chain(rotate1)
    rotate1.interpolation(TWEEN.Interpolation.Bezier)
    rotate1.easing(TWEEN.Easing.Sinusoidal.InOut)
    rotate4.onComplete(function() {
      rotate1.start()
    }.bind(this))
    rotate1.start()
}

Game.prototype.zoomAnimation = function(callback) {
  var self = this
  var cameraPos = this.camera.position
  var zFinal = 200
  // hypontenuse
  var h = Math.sqrt(Math.pow(cameraPos.x, 2) + Math.pow(cameraPos.y, 2))
  var ratio = zFinal / cameraPos.z
  var yFinal = Math.round(cameraPos.y * ratio)
  var origin = new TWEEN.Tween({
    x: cameraPos.x,
    z: cameraPos.z
  })
  .to({
    x: 0,
    z: this.radius
  }, 2000)
  .easing(TWEEN.Easing.Sinusoidal.InOut)
  .onUpdate(function() {
    self.camera.position.setX(this.x)
    self.camera.position.setZ(this.z)
    self.camera.lookAt(new THREE.Vector3(0, 0, 0))
  })
  var zoom = new TWEEN.Tween({
    z: this.radius,
    y: cameraPos.y
  })
  .to({z: zFinal, y: yFinal}, 1000 * 15)
  .onUpdate(function() {
    self.camera.position.setZ(this.z)
    self.camera.position.setY(this.y)
  })
  .onComplete(callback)
  .easing(TWEEN.Easing.Sinusoidal.InOut)
  origin.chain(zoom)
  origin.start()
}

Game.prototype.updateTween = function() {
  TWEEN.update()
}

Game.prototype.initUPos = function() {
  var vec = new THREE.Vector3()
  vec.setX(parseInt(this.id.slice(0, UPOS_MAGNITUDE), 16))
  vec.setY(parseInt(this.id.slice(UPOS_MAGNITUDE, UPOS_MAGNITUDE * 2), 16))
  vec.setZ(parseInt(this.id.slice(UPOS_MAGNITUDE * 2, UPOS_MAGNITUDE * 3), 16))
  console.log(vec)
}

Game.prototype.tick = function(delta) {
  for(var i = 0, len = this.items.length; i < len; ++i) {
    this.items[i].tick(delta)
  }

  // if (this.materials) this.materials.tick(delta)
  this.controls.update()
  tic.tick(delta)

  this.emit('tick', delta)

  TWEEN.update()

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

  if (!opts.statsDisabled) self.addStats()

  window.addEventListener('resize', self.onWindowResize.bind(self), false)

  requestAnimationFrame(window).on('data', function(dt) {
    self.emit('prerender', dt)
    self.render(dt)
    self.emit('postrender', dt)
  })
  if (typeof stats !== 'undefined') {
    self.on('postrender', function() {
      stats.update()
    })
  }
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

Game.prototype.addStats = function() {
  stats = new Stats()
  stats.domElement.style.position  = 'absolute'
  stats.domElement.style.bottom  = '0px'
  document.body.appendChild( stats.domElement )
}

Game.prototype.appendTo = function (element) {
  this.view.appendTo(element)
}

Game.prototype.destroy = function() {
  clearInterval(this.timer)
}

module.exports = Game
