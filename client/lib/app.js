var Client = require('./client.js')

module.exports.start = function() {
  new Client(Math.random() + '', Math.random() + '')
}
