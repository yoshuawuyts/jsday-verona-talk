if (process.argv[2] === 'start') {
  // pipe things over http
} else if (process.argv[2] === 'build') {
  // pipe things to disk
} else {
  throw new Error('oops, we only support build & start')
}

var createHtml = require('create-html')
var html = createHtml({ script: 'bundle.js' })
console.log(html)

var browserify = require('browserify')
var b = browserify('app.js')
b.transform('sheetify/transform')

var outStream = process.stdout
b.bundle().pipe(outStream)
