var crypto = require('crypto-browserify')
var Peer = require('peerjs-browserify-unofficial').Peer

var Game = require('./game.js')
var PeerManager = require('./peer-manager.js')
var ChatClient = require('./chat-client.js')
var LoginView = require('./login-view.js')
var audio = require('./game-audio.js')()

function Client(user, pass) {
  var sha = this.sha = crypto.createHash('sha256')
  this.sha.update(user + pass)
  var id = this.id = sha.digest('hex')
  console.log('Client id: ', id)
  this.game = new Game({
    id: id
  })
  this.game.appendTo(document.body)
  // this.peer = new Peer(id, {
  //   host: '/',
  //   port: '9000'
  // })
  // this.manager = new PeerManager(this.peer)
  audio.on('load', function() {
    document.querySelector('.loading').style.display = 'none'
    audio.get('tronfinal').play()
    var login = this.login = new LoginView()
    login.on('login', function() {
      login.el.addEventListener('webkitTransitionEnd', function() {
        login.el.style.display = 'none'
      }.bind(this))
      this.game.startGame()
    }.bind(this))
  }.bind(this))
  // this.chat = new ChatClient(this.manager)
  // document.body.appendChild(this.chat.el)
}

module.exports = Client
