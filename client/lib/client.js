var crypto = require('crypto-browserify')
var Peer = require('peerjs-browserify-unofficial').Peer

var Game = require('./game.js')
var PeerManager = require('./peer-manager.js')

function Client(user, pass) {
  var sha = this.sha = crypto.createHash('sha256')
  this.sha.update(user + pass)
  var id = this.id = sha.digest('hex')
  console.log('Client id: ', id)
  this.game = new Game({
    id: id
  })
  this.game.appendTo(document.body)
  this.peer = new Peer(id, {
    host: '/',
    port: '9000'
  })
  this.manager = new PeerManager(id)
}

module.exports = Client
