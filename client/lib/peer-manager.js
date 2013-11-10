var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
var xhr = require('xhr')

function PeerManager(id) {
  this.id = id
  this.peers = []
  this.initPolling()
}
inherits(PeerManager, EventEmitter)

PeerManager.prototype.initPolling = function() {
  this.poll()
  this.interval = setInterval(this.poll.bind(this), 5000)
}

PeerManager.prototype.poll = function() {
  xhr({uri: '/peer'}, function(err, res, body) {
    console.log('peer!', err, res, body)
  })
}

module.exports = PeerManager
