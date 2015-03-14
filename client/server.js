var static = require('node-static')

var server = new static.Server('./public')

require('http').createServer(function (req, res) {
  req.addListener('end', function () {
    server.serve(req, res)
  }).resume()
}).listen(8080)

console.log('Serving public/ at port 8080')
