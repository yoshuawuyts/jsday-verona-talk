// Framework code
var serverRouter = require('server-router')
var envobj = require('envobj')
var http = require('http')
var pino = require('pino')

function Framework (opts) {
  if (!(this instanceof Framework)) return new Framework(opts)
  opts = opts || {}
  this.env = opts.env || {}
  envobj(this.env)
  this._uuid = 0
  this._router = serverRouter()
  this.log = pino()
}

Framework.prototype.route = function (method, route, handler) {
  var self = this
  this._router.route(method, route, function (req, res, ctx) {
    ctx.log = self.log.child({ id: self._uuid++ })
    handler(req, res, ctx)
  })
  return this
}

Framework.prototype.listen = function (port) {
  var self = this
  var server = http.createServer(this._router.start())
  server.listen(port, function () {
    self.log.info('listening on port ' + port)
  })
}

// Application code
var memdb = require('memdb')

var db = memdb()
var env = { PORT: 1337 }
var app = Framework({ env: env })

app.route('GET', '/', function (req, res, ctx) {
  ctx.log.info('GET /')
  db.get('value', function (err, value) {
    if (err) {
      res.statusCode = 400
      res.end()
    }
    res.end(JSON.stringify({ value: value }))
  })
})

app.route('POST', '/:value', function (req, res, ctx) {
  var value = ctx.params.value
  ctx.log.info('POST ' + value)
  db.put('value', value, function (err) {
    if (err) {
      res.statusCode = 500
      res.end()
    }
    res.end('value set ' + value)
  })
})

app.listen(app.env.PORT)
