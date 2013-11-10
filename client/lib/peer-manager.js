var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
var xhr = require('xhr')
var diff = require('array-diff')()

function PeerManager(peer) {
  this.peer = peer
  this.id = peer.id
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
    var json = JSON.parse(body)
    if (json && json.ids && json.ids.length) {
      // remove own id
      var ids = json.ids
      var i = ids.indexOf(this.id)
      if (i != -1)
        ids.splice(i, 1)
      // diff last peer list with this one and emit events
      diff(this.peers, ids).forEach(function(item) {
        if (item[0] === '-')
          this.emit('disconnect', item[1])
        else if (item[0] == '+')
          this.emit('connect', item[1])
      }.bind(this))
      // record current peer list
      this.peers = ids
    }
  }.bind(this))
}

module.exports = PeerManager
