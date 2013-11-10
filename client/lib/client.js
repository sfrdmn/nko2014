var Game = require('./game.js')
var rng = require('rng')
var crypto = require('crypto-browserify')

function Client(user, pass) {
  var sha = this.sha = crypto.createHash('sha256')
  this.sha.update(user + pass)
  var id = this.id = sha.digest('hex')
  console.log('Client id: ', id)
  this.game = new Game({
    id: id
  })
  this.game.appendTo(document.body)
}

module.exports = Client
