var Client = require('./client.js')

function App() {
  this.client = new Client(Math.random() + '', Math.random() + '')
}

module.exports = function() {
  return new App
}
