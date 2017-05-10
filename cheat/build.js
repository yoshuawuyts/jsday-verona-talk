var createHtml = require('create-html')
var browserify = require('browserify')
var mkdirp = require('mkdirp')
var path = require('path')
var http = require('http')
var fs = require('fs')

var b = browserify(path.join(__dirname, 'app.js'))
b.transform('sheetify/transform')

if (process.argv[2] === 'start') {
  start()
} else if (process.argv[2] === 'build') {
  build()
} else {
  throw new Error('oops, we only support build & start')
}

function start () {
  http.createServer(function (req, res) {
    if (req.url === '/') {
      var html = createHtml({ script: 'bundle.js' })
      res.end(html)
    } else if (req.url === '/bundle.js') {
      b.bundle().pipe(res)
    } else {
      res.statusCode = 404
      res.end('not found')
    }
  }).listen(1337, function () {
    console.log('listening on port 1337')
  })
}

function build () {
  var dir = path.join(process.cwd(), 'dist')
  mkdirp(dir, function (err) {
    if (err) throw err

    var html = createHtml({ script: 'bundle.js' })
    fs.writeFileSync(path.join(dir, 'index.html'), html)
    b.bundle().pipe(fs.createWriteStream(path.join(dir, 'bundle.js')))
  })
}
