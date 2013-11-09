// https://github.com/maxogden/voxel-engine

var tic = require('tic')()
var requestAnimationFrame = require('raf')
var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter

var ResourceLoader = require('./resource-loader.js')
// var GameAudio = require('./game-audio.js')
var View = require('./view.js')

function Game(opts) {
  opts = opts || {}
  this.view = new View(THREE)
  this.scene = new THREE.Scene()
  this.view.bindToScene(this.scene)
  this.camera = this.view.getCamera()
  this.timer = this.initializeTimer((opts.tickFPS || 16))
  this.paused = false

  // this.loader = new ResourceLoader()
  // this.audio = new GameAudio(this.loader)
  // this.loader.on('load', this.onLoaded.bind(this))
}
inherits(Game, EventEmitter)

Game.prototype.tick = function(delta) {
  // for(var i = 0, len = this.items.length; i < len; ++i) {
  //   this.items[i].tick(delta)
  // }

  // if (this.materials) this.materials.tick(delta)

  tic.tick(delta)

  this.emit('tick', delta)

  // if (!this.controls) return
  // var playerPos = this.playerPosition()
  // this.spatial.emit('position', playerPos, playerPos)
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

Game.prototype.destroy = function() {
  clearInterval(this.timer)
}

Game.prototype.onLoaded = function() {
  this.audio.start()
}

module.exports = Game
