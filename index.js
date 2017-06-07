var highlight = require('highlight-syntax/all')
var html = require('choo/html')
var marked = require('marked')
var log = require('choo-log')
var css = require('sheetify')
var choo = require('choo')
var fs = require('fs')

var src = fs.readFileSync('slides.md', 'utf8')
var els = splitter(toHtml(marked(src, { highlight: highlight })))

var style = css`
  :host { background-color: pink; }
  a { color: white; }
`

css('highlight-syntax-pastel')
css('tachyons')

var app = choo()
app.use(log())
createRoute(app, els)
app.use(keyNav)
app.mount('body')

function keyNav (state, emitter) {
  state.max = els.length - 1

  emitter.on('DOMContentLoaded', function () {
    document.body.addEventListener('keyup', function (e) {
      var loc = window.location.hash.replace('#', '')
      var num = loc ? Number(loc) : 0
      if (e.key === 'ArrowLeft' || e.key === 'h') {
        var lnum = num - 1
        var lloc = lnum === 0 ? '/' : '#' + lnum
        if (!(lnum < 0)) {
          emitter.emit('pushState', lloc)
        }
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        var rnum = num + 1
        var rloc = rnum === 0 ? '/' : '#' + rnum
        if (!(rnum > state.max)) {
          emitter.emit('pushState', rloc)
        }
      }
    })
  })
}

function toHtml (str) {
  var el = document.createElement('div')
  el.innerHTML = str
  return el.childNodes
}

function splitter (arr) {
  var len = arr.length
  var curr = []
  var res = []

  for (var i = 0; i < len; i++) {
    var el = arr[i]
    el = fmt(el)

    var nodeName = el.nodeName.toLowerCase()
    if (i === len - 1) {
      if (nodeName !== 'hr') curr.push(el)
      res.push(curr)
    } else if (nodeName === 'hr') {
      res.push(curr)
      curr = []
    } else {
      curr.push(el)
    }
  }

  return res

  function fmt (el) {
    var nodeName = el.nodeName.toLowerCase()
    if (nodeName === 'h1') el.setAttribute('class', 'f-5 ttu')
    if (nodeName === 'h2') el.setAttribute('class', 'f1 ttu')
    if (nodeName === 'pre') el.setAttribute('class', 'f3 bg-dark-gray mw9 pa4 tl overflow-y-auto')
    if (nodeName === 'ul') el.setAttribute('class', 'f2 list b lh-copy')
    return el
  }
}

function createRoute (app, els) {
  els.forEach(function (el, i) {
    if (i === 0) {
      app.route('/', view(el))
    } else {
      app.route('#' + i, view(el))
    }
  })

  function view (content) {
    return function (state, emit) {
      var _content = content.map(function (el) {
        return el.cloneNode(true)
      })
      return html`
        <body class="${style} sans-serif flex justify-center items-center">
          <main class="mw8 w-100 tc f2 b">
            ${_content}
          </main>
        </body>
      `
    }
  }
}
