// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('f4N75jqVb2ks5NHv');

var connect = require('connect')
var fs = require('fs')
var urlrouter = require('urlrouter')
var PeerServer = require('peer').PeerServer

var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = (isProduction ? 80 : 8000);

var p2pBroker = new PeerServer({
  port: 9000
})

var router = urlrouter(function(app) {

  // Get client
  app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    fs.createReadStream(__dirname + '/client/index.html').pipe(res)
  })

  // Hack to allow polling of connected peers
  app.get('/peer', function(req, res) {
    var clients = p2pBroker._clients
    var response = {
      ids: []
    }
    Object.keys(clients).forEach(function(key) {
      Object.keys(clients[key]).forEach(function(id) {
        response.ids.push(id)
      })
    })
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(response))
  })
})

var middleware = connect()
    .use(router)
    .use(connect.static(__dirname + '/client/public'))
    .use(connect.directory(__dirname + '/client/public'))

http.createServer(middleware).listen(port, function(err) {
  if (err) { console.error(err); process.exit(-1); }

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0) {
    require('fs').stat(__filename, function(err, stats) {
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
    });
  }

  console.log('Server running at http://0.0.0.0:' + port + '/');
});
