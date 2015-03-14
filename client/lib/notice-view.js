var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
var elClass = require('element-class')

var getTemplate = require('./template.js')

function NoticeView (msg, options) {
  options = options || {}
  var self = this
  var delay = options.delay || 1
  var duration = options.duration || 7000
  var el = this.el = document.querySelector('.notice-dialog-c')
  if (!el) {
    el = getTemplate('tmpl-notice')
    elClass(el).add('fade')
    document.body.appendChild(el)
  }
  this.message = el.querySelector('.message')
  this.message.innerHTML = msg
  setTimeout(show, delay)
  setTimeout(hide, delay + duration)

  function setTransitionEndListener (el, fn) {
    setTimeout(function () {
      el.addEventListener('webkitTransitionEnd', onTransitionEnd)
      el.addEventListener('transitionend', onTransitionEnd)
      function onTransitionEnd () {
        el.removeEventListener('webkitTransitionEnd', onTransitionEnd)
        el.removeEventListener('transitionend', onTransitionEnd)
        fn.apply(null, arguments)
      }
    }, 0)
  }

  function show () {
    elClass(el).remove('fade-out')
    elClass(el).add('fade-in')
    setTransitionEndListener(el, function () {
      self.emit('shown')
    })
  }

  function hide () {
    elClass(el).remove('fade-in')
    elClass(el).add('fade-out')
    setTransitionEndListener(el, function () {
      self.emit('hidden')
    })
  }
}
inherits(NoticeView, EventEmitter)

module.exports = NoticeView
