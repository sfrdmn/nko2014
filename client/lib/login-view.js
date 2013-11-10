var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter
var elClass = require('element-class')

var getTemplate = require('./template.js')
var audio = require('./game-audio.js')()

function LoginView() {
  this.el = getTemplate('tmpl-login')
  this.form = this.el.querySelector('form')
  this.button = this.el.querySelector('button')
  this.userInput = this.el.querySelector('#username')
  this.passInput = this.el.querySelector('#password')
  document.body.appendChild(this.el)
  elClass(this.el).add('fade fade-in')

  this.form.addEventListener('submit', this.onSubmit.bind(this))
  this.el.addEventListener('click', this.stopPropagation.bind(this))
}
inherits(LoginView, EventEmitter)

LoginView.prototype.stopPropagation = function(e) {
  e.stopPropagation()
}

LoginView.prototype.onSubmit = function(e) {
  e.preventDefault()
  elClass(this.el).remove('fade-in')
  elClass(this.el).add('fade-out')
  audio.get('Login').play()
  this.emit('login', this.userInput.value, this.passInput.value)
}

module.exports = LoginView
