var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter

var getTemplate = require('./template.js')

function ChatClient(manager) {
  this.manager = manager
  this.peer = manager.peer
  this.el = getTemplate('tmpl-chat')
  this.isActive = true

  this.manager.on('connect', function(id) {
    console.log('Connected!', id)
    this.connect(id)
  }.bind(this))
  this.peer.on('connection', this.onConnection.bind(this))
  window.addEventListener('keydown', this.onKeyDown.bind(this))
}
inherits(ChatClient, EventEmitter)

ChatClient.prototype.connect = function(id) {
  console.log('connecting...', id)
  if (!this.conn) {
    this.conn = this.peer.connect(id)
    this.conn.on('open', function() {
      // this.conn.off('connection')
      console.log('connected to!')
      this.conn.on('data', this.onData.bind(this))
    }.bind(this))
  }
}

ChatClient.prototype.onConnection = function(conn) {
  this.conn = conn
  // conn.off('connection')
  console.log('got connected to!')
  conn.on('data', this.onData.bind(this))
}

ChatClient.prototype.onData = function(data) {
  console.log('Chat. Receiving:', data)
  var json = JSON.parse(data)
  if (json && json.type && json.type === 'chat') {
    this.receiveChat(json.msg)
  }
}

ChatClient.prototype.sendData = function(msg) {
  var data = JSON.stringify({
    type: 'chat',
    msg: msg
  })
  console.log('Chat. Sending:', data)
  this.conn.send(data)
}

ChatClient.prototype.addMessage = function(msg, msgClass) {
  console.log('MESSAGE', msg)
  var elMsg = document.createElement('div')
  elMsg.setAttribute('class', 'message ' + msgClass)
  elMsg.innerHTML = msg
  var viewport = this.el.querySelector('.viewport')
  viewport.appendChild(elMsg)
}

ChatClient.prototype.receiveChat = function(msg) {
  this.addMessage(msg, 'incoming')  
}

ChatClient.prototype.sendChat = function() {
  var inputEl = this.el.querySelector('input')
  var msg = inputEl.value
  inputEl.value = ''
  this.addMessage(msg, 'outgoing')
  this.sendData(msg)
}

ChatClient.prototype.onKeyDown = function(e) {
  switch (e.keyCode) {
    case 13:
      this.sendChat()
      break
  }
}

module.exports = ChatClient
