var nanorouter = require('nanorouter')
var nanotiming = require('nanotiming')
var nanomorph = require('nanomorph')
var nanoraf = require('nanoraf')
var nanobus = require('nanobus')
var html = require('bel')

function Framework (opts) {
  if (!(this instanceof Framework)) return new Framework(opts)
  this._timing = nanotiming('framework')
  this._rerender = null
  this._tree = null

  this.router = nanorouter({ curry: true })
  this.emitter = nanobus()
  this.state = {}
}

Framework.prototype.route = function (route, handler) {
  var self = this
  this.router.on(route, function (params) {
    return function () {
      self.state.params = params
      var res = handler(self.state, function (eventName, data) {
        self.emitter.emit(eventName, data)
      })
      return res
    }
  })
}

Framework.prototype.use = function (cb) {
  cb(this.state, this.emitter)
}

Framework.prototype.start = function () {
  var self = this
  this._tree = this.router(window.location.pathname)
  this._rerender = nanoraf(function () {
    var newTree = self.router(window.location.pathname)
    self._tree = nanomorph(self._tree, newTree)
  })
  this.emitter.on('render', this._rerender)
  return this._tree
}

var app = Framework()
app.route('/', function (state, emit) {
  return html`
    <main>
      <button onclick=${onclick}>
        hello ${state.counter}
      </button>
    </main>
  `

  function onclick () {
    emit('click')
  }
})

app.use(function (state, emitter) {
  state.counter = 0
  emitter.on('click', function () {
    state.counter += 1
    emitter.emit('render')
  })
})
var tree = app.start()
document.body.appendChild(tree)
