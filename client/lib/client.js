var Game = require('./game.js')

function Client() {
  this.game = new Game()
  this.game.appendTo(document.body)
}

module.exports = Client
