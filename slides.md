# building a full stack

---

# ciao verona

---

# let's write 3 frameworks today

---

# what, seriously?

---

# yep

---

- build a backend framework from scratch
- build a frontend framework from scratch
- build a build system from scratch
- build a backend framework from scratch
- build a frontend framework from scratch
- build a build system from scratch
- build a backend framework from scratch
- build a frontend framework from scratch
- build a build system from scratch
- build a backend framework from scratch
- build a frontend framework from scratch
- build a build system from scratch

---

# frontend app

- input field that updates some text
- hit a button to save on server

---

# frontend framework

- unidirectional rendering
- route views
- cap at 60fps
- event emitter
- xhr

---

# backend app

- validates a request
- saves to a database

---

# backend framework

- route requests
- validate env vars
- logging

---

# build framework

- serve {html,css,js} over http
- compile {html,css,js} and write to disk

---

# HTTP

```js
var http = require('http')
var server = http.createServer(function (req, res) {
  res.end('hello world')
})

var port = 8080
server.listen(port)
```

---

# create-html for html

```js
var createHtml = require('create-html')
var html = createHtml({ script: 'bundle.js' })
console.log(html)
```

---

# browserify for js

```js
var browserify = require('browserify')
var b = browserify('app.js')

var outStream = process.stdout
b.bundle().pipe(outStream)
```

---

# sheetify for css

```js
var browserify = require('browserify')
var b = browserify('app.js')
b.transform('sheetify/transform')

var outStream = process.stdout
b.bundle().pipe(outStream)
```

---

# sheetify example

```js
var css = sheetify

// global styles
css`.my-class { color: blue }`

// prefixed styles
var style = css`:host { color: blue }`

// styles from npm
css('tachyons')
```

---

# CLI to bind things together

```js
if (process.argv[2] === 'start') {
  // pipe things over http
} else if (process.argv[2] === 'build') {
  // pipe things to disk
} else {
  throw new Error('oops, we only support build & start')
}
```

---

# packages used
- browserify
- sheetify
- create-html

---

# what didn't we do?
- static render pages
- extract css to separate file
- optimize it all
- serve assets

---

# github.com/yoshuawuyts/bankai

---

# Server time

- validates a request
- saves to a database
- logging
- routing

---

# framework usage

```js
var env = { PORT: 1337 }
var app = Framework({ env: env })

app.route('GET', '/:username', function (req, res, ctx) {
  ctx.log.info('GET ' + ctx.params.username)
  res.end('username is ' + ctx.params.username)
})

app.listen(app.env.PORT)
```

---

# framework framework

```js
function Framework (opts) {
  if (!(this instanceof Framework)) return new Framework(opts)
}

Framework.prototype.start = function () {
}
```

---

# env var validation

```js
var envobj = require('envobj')
function Framework (opts) {
  opts = opts || {}
  this.env = opts.env || {}
  envobj(this.env)
}
```

---

# router

```js
var serverRouter = require('server-router')
var router = serverRouter()
router.route('GET', '/:name', function (req, res, ctx) {
  res.end(ctx.params.name)
})
http.createServer(router.start()).listen()
```

---

# logging

```js
var pino = require('pino')
var logger = pino('framework')
var childLogger = logger.child({ uuid: 'some id' })
childLogger.info('hello planet')
```

---

# framework logging

```js
function Framework () {
  this.router = serverRouter()
  this.log = pino()
  this.uuid = 0
}
Framework.prototype.route = function (method, url, handler) {
  var self = this
  this.router.route(method, url, function (req, res, ctx) {
    ctx.log.child({ uuid: self.uuid })
    handler(req, res, ctx)
  })
}
```

---

# framework http

```js
var http = require('http')

function Framework () {
  this.router = serverRouter()
  this.log = pino()
}
Framework.prototype.listen = function (port) {
  var self = this
  var server = http.createServer(this.router.start())
  server.listen(port, function () {
    self.log.info('server listening on port ' + port)
  })
}
```

---

# create a db
```js
var memdb = require('memdb')
var db = memdb()
memdb.put('foo', 'bar', function (err) {
  if (err) throw err
})
```

---

# packages used
- envobj
- pino
- server-router

---

# what didn't we do?
- consistent error handling
- handle unknown routes