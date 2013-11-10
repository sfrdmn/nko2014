var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
var TWEEN = require('tween.js')

var voxaudio = require('voxel-audio')

var FILENAMES = {
  'piano3': {
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
  voxaudio.initGameAudio(game)
  this.posAudio = new voxaudio.PositionAudio({
    url: getAudioURL('piano3'),
    startingPosition: [0, 0, 0],
    coneOuterAngle : 360,
    coneInnerAngle : 360,
    refDistance : 100,
    loop: true
  })
  this.posAudio.load(function() {
    this.posAudio.play()
  }.bind(this))
}

GameAudio.prototype.has = function(name) {
  return typeof this.cache[name] !== 'undefined'
}

GameAudio.prototype.get = function(name) {
  return this.cache[name]
}

// GameAudio.prototype.setVolume = function(name, volume) {
//   if (this.has(name))
//     this.get(name).volume = volume
// }

// GameAudio.prototype.play = function(name) {
//   if (this.has(name))
//     this.get(name).play()
// }

// GameAudio.prototype.pause = function(name) {
//   if (this.has(name))
//     this.get(name).pause()
// }

// GameAudio.prototype.stop = function(name) {
//   if (this.has(name))
//     this.get(name).stop()
// }

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

var instance = new GameAudio()
module.exports = function() {
  return instance
}
module.exports.FILENAMES = FILENAMES
module.exports.DIR = DIR
module.exports.getAudioURL = getAudioURL
