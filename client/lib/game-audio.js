var audio = require('voxel-audio')

function GameAudio(game) {
  audio.initGameAudio(game)
  var bg = new audio.PositionAudio({
    url: './audio/piano.ogg',
    startingPosition: [0, 0, 0],
    coneOuterAngle : 360,
    coneInnerAngle : 360,
    refDistance : 100,
    loop: true
  })
  bg.load(function() {
    console.log('loaded bro!')
    bg.play()
  })
}

module.exports = GameAudio
