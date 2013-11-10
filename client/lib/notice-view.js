var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
var elClass = require('element-class')

var getTemplate = require('./template.js')

function NoticeView() {
  this.el = getTemplate('tmpl-notice')
  this.message = this.el.querySelector('.message')
  this.message.innerHTML = 'You are a planet.'
  document.body.appendChild(this.el)
  elClass(this.el).add('fade')
  setTimeout(this.onShow.bind(this), 2500)
  setTimeout(this.onHide.bind(this), 7500)
}
inherits(NoticeView, EventEmitter)

NoticeView.prototype.onShow = function() {
  elClass(this.el).add('fade-in')
}

NoticeView.prototype.onHide = function() {
  elClass(this.el).remove('fade-in')
  elClass(this.el).add('fade-out')
  this.el.addEventListener('webkitEndTransition', function() {
    this.el.style.display = 'none'
  }.bind(this))
}

module.exports = NoticeView
