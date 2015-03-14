var eases = require('eases')
var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
var THREE = require('three')
var TWEEN = require('tween.js')

var createQuadInOut = function (min, max) {
  return function (val) {
    if (val >= max) {
      return 1
    } else if (val <= min) {
      return 0
    } else {
      return linear((val - min) / (max - min))
    }
  }
}

var createEase = function (name, min, max) {
  var ease = eases[name] || function (val) { return val }
  return function (val) {
    if (val >= max) {
      return 1
    } else if (val <= min) {
      return 0
    } else {
      return ease((val - min) / (max - min))
    }
  }
}

var voxaudio = require('voxel-audio')

var FILENAMES = {
  'pin': {
    type: '.ogg'
  },
  'spacezoomout': {
    type: '.ogg'
  },
  'start': {
    type: '.ogg'
  },
  'tronfinal': {
    type: '.ogg'
  }
}

var DIR = 'sound/'

function GameAudio(game) {
  this.preload()
}
inherits(GameAudio, EventEmitter)

GameAudio.prototype.startPosAudio = function(game) {
  var posAudio = this.posAudio = new SimplePositionalAudio(game, this.get('pin'), {
    range: [500, 2000]
  })
  posAudio.play()
}

GameAudio.prototype.has = function(name) {
  return typeof this.cache[name] !== 'undefined'
}

GameAudio.prototype.get = function(name) {
  return this.cache[name]
}

GameAudio.prototype.preload = function() {
  this.cache = {}
  var filenames = Object.keys(FILENAMES)
  this.numFiles = filenames.length
  this.numLoaded = 0
  filenames.forEach(function(name) {
    var audio = new AudioWrapper(name)
    audio.load()
    this.trackLoaded(audio)
    this.cache[name] = audio
  }.bind(this))
}

GameAudio.prototype.trackLoaded = function(audio) {
  audio.on('load', function() {
    this.numLoaded++
    if (this.numFiles === this.numLoaded) {
      this.loaded = true
      this.emit('load')
    }
  }.bind(this))
}

function AudioWrapper(name) {
  var audio = this.audio = new Audio()
  var url = this.url = getAudioURL(name)
  var type = this.type = getAudioType(name)

  audio.addEventListener('canplaythrough', this.onLoad.bind(this))
  audio.addEventListener('error', this.onError.bind(this))
  audio.addEventListener('ended', this.onEnded.bind(this))
  audio.setAttribute('src', url)
}
inherits(AudioWrapper, EventEmitter)

AudioWrapper.prototype.fadeOut = function(ms) {
  ms = ms || 1000
  var self = this
  this.tween = new TWEEN.Tween({volume: this.volume})
    .to({volume: 0}, ms)
    .onUpdate(function() {
      self.volume = this.volume
    })
    .start()
}

AudioWrapper.prototype.fadeIn = function(ms, endVolume) {
  ms = ms || 1000
  endVolume = endVolume || 1
  var self = this
  this.tween = new TWEEN.Tween({volume: this.volume})
    .to({volume: endVolume}, ms)
    .onUpdate(function() {
      self.volume = this.volume
    })
    .start()
}

AudioWrapper.prototype.load = function() {
  this.audio.load()
}

AudioWrapper.prototype.play = function() {
  // screw loading dance, just play later if not loaded yet
  if (!this.loaded)
    this.playOnLoad = true
  else
    this.audio.play()
}

AudioWrapper.prototype.pause = function() {
  this.audio.pause()
}

AudioWrapper.prototype.stop = function() {
  this.audio.pause()
  this.audio.currentTime = 0
}

AudioWrapper.prototype.onLoad = function() {
  console.log('Loaded audio file!', this.url)
  this.loaded = true
  this.emit('load')
  if (this.playOnLoad)
    this.play()
}

AudioWrapper.prototype.onError = function() {
  console.error('Could not load audio file!', this.url)
}

AudioWrapper.prototype.onEnded = function() {
  this.emit('ended')
}

Object.defineProperty(AudioWrapper.prototype, 'volume', {
  enumerable: true,
  get: function() {
    return this.audio.volume
  },
  set: function(volume) {
    this.audio.volume = volume
  }
})

function getAudioURL(name) {
  return DIR + name + FILENAMES[name].type
}

function getAudioType(name) {
  return FILENAMES[name].type
}

/**
 * Simple positional audio effect which updates
 * volume as a function of distance from sound source.
 */
function SimplePositionalAudio (game, audio, options) {
  options = options || {}
  if (!audio || !game) return
  var pos = this.pos = options.pos || new THREE.Vector3(0, 0, 0)
  var range = this._range = options.range || [10, 1000]
  var ease = this._ease = createEase('linear', range[0], range[1])
  this._audio = audio
  this._game = game

  game.on('tick', tick)

  function tick () {
    var cameraPos = game.camera.position
    var distance = cameraPos.distanceTo(pos)
    console.log(distance, 1 - ease(distance))
    audio.volume = 1 - ease(distance)
  }
}
inherits(SimplePositionalAudio, EventEmitter)

SimplePositionalAudio.prototype.play = function () {
  this._audio.play()
}

var instance = new GameAudio()
module.exports = function() {
  return instance
}
module.exports.FILENAMES = FILENAMES
module.exports.DIR = DIR
module.exports.getAudioURL = getAudioURL
