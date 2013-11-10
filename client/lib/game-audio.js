var voxaudio = require('voxel-audio')

var FILENAMES = {
  'piano3': {
    type: '.ogg'
  },
  'tron2': {
    type: '.ogg'
  }
}

var DIR = 'sound/'

function GameAudio(game) {
  this.preload()
  this.play('tron2')
  voxaudio.initGameAudio(game)
  var bg = new voxaudio.PositionAudio({
    url: getAudioURL('piano3'),
    startingPosition: [0, 0, 0],
    coneOuterAngle : 360,
    coneInnerAngle : 360,
    refDistance : 100,
    loop: true
  })
  bg.load(function() {
    bg.play()
  })
}

GameAudio.prototype.has = function(name) {
  return typeof this.cache[name] !== 'undefined'
}

GameAudio.prototype.get = function(name) {
  return this.cache[name]
}

GameAudio.prototype.play = function(name) {
  if (this.has(name))
    this.get(name).play()
}

GameAudio.prototype.pause = function(name) {
  if (this.has(name))
    this.get(name).pause()
}

GameAudio.prototype.stop = function(name) {
  if (this.has(name))
    this.get(name).stop()
}

GameAudio.prototype.preload = function() {
  this.cache = {}
  Object.keys(FILENAMES).forEach(function(name) {
    var audio = new AudioWrapper(name)
    audio.load()
    this.cache[name] = audio
  }.bind(this))
}

function AudioWrapper(name) {
  var audio = this.audio = new Audio()
  var url = this.url = getAudioURL(name)
  var type = this.type = getAudioType(name)

  audio.addEventListener('canplaythrough', this.onLoad.bind(this))
  audio.addEventListener('error', this.onError.bind(this))
  audio.setAttribute('src', url)
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

Object.defineProperty(AudioWrapper.prototype, 'volume', {
  enumerable: true,
  get: function() {
    return this.audio.volume
  },
  set: function(volume) {
    this.audio.volume = volume
  }
})

AudioWrapper.prototype.onLoad = function() {
  console.log('Loaded audio file!', this.url)
  this.loaded = true
  if (this.playOnLoad)
    this.play()
}

AudioWrapper.prototype.onError = function() {
  console.error('Could not load audio file!', this.url)
}

function getAudioURL(name) {
  return DIR + name + FILENAMES[name].type
}

function getAudioType(name) {
  return FILENAMES[name].type
}

module.exports = GameAudio

module.exports.FILENAMES = FILENAMES
module.exports.DIR = DIR
module.exports.getAudioURL = getAudioURL
