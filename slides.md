# Browser Framework Fundamentals

---

# Or how I learned to love template strings

- (no flashy animations, no worries)

---

# hallo Amsterdam

- I'm yosh
- Computer dad @ dat project
- Niederlandisch

---

# yay, frontend

---

# ok
# ok
# ok
# fine
# ok
# ok
# ok

---

# YAY, FRONTEND
# YAY, FRONTEND
# YAY, FRONTEND
# YAY, "FRONTEND"
# YAY, FRONTEND

---

# yay frameworks
- (and if we have time left: demos)

---

# choo

- 4kb
- like, 3 methods
- full on MVC
- does routing, logic, templates
- rich ecosystem

---

# choo
# DOM diffing with real DOM nodes

---

# whyyyy

- lowest level abstraction
- teach folks how to DOM
- A-OK performance

---

# hello grampsterdam

```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.route('/', function (state, emit) {
  return html`<body>hello yamsterdam</body>`
})
app.mount('body')
```

---

# template strings

- DSL support inside JS
- no more need for parser forks
- compilation only for optimizations

---

# yamplate strings

- HTML and SVG by `bel`
- CSS by `sheetify`
- GLSL by `glslify`

---

# yumplate strings

```js
var css = require('sheetify')
var html = require('bel')

var styles = css`
  :host {
    background-color: blue;
    color: white;
  }
`

var el = html`
  <section class=${styles}>Howdy planet</section>
`

document.body.appendChild(el)
```

---

# coooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooool
# coooooool
# cooooooooooool
# coooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooool
# coooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooool
# coooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooool

---

# ok, so what else

- render performance
- user timings
- trace logging
- lifecycle detection
- assertions

---

# [ rant about benchmarks for 45 seconds ]

---

# render performance act 1

---

# request animation frame

- run an action on the next frame
- or current frame if no paints happened last frame
- recursive call -> 60fps loop
- best used as an upper cap for rendering

---

# npm install nanoraf

```js
var nanoraf = require('nanoraf')

var raf = nanoraf(function () {
  console.log(val)
})

var val = 1 && raf()
val = 2 && raf()
val = 3 && raf()
```

---

# render performance act 2

---

# use idle time
- `window.requestIdleCallback()`
- every frame is 16ms
- perform tasks in spare time _after_ paint
- should take `<50ms`
- __don't perform ops on the DOM__

---

# npm install on-idle

```js
var onIdle = require('on-idle')
onIdle(function () {
  console.log('yay, doing stuff in idle time!')
})
```

---

# render performance act 3

---

# the render loop (on chrome)
- `microtask queue` resolves first
- `setTimeout()` timers resolve second
- `requestAnimationFrame()` resolves third
- paints and reflows
- `requestIdleCallback()` resolves last

---

# npm install nanotask

```js
var nanotask = require('nanotask')

var queue = nanotask()

queue(function () {
  console.log('yay, hooking into mutation observers')
})

queue(function () {
  console.log('but not promises b/c try...catch')
})
```

---

# trace logging

- b/c measuring = knowing

---

# measuring things!
```js
// create unique names
var startName = 'start-my-mark-' + window.performance.now()
var endName = 'end-my-mark-' + window.performance.now()
var measureName = 'my-mark-' + window.performance.now()

// create marks around an operation
window.performance.mark(startName)
var i = 1000; while (--i) console.log(i)
window.performance.mark(endName)

window.requestIdleCallback(function () {
  // measure the time between marks
  window.performance.measure(measureName, startName, endName)
  var measure = window.performance.getEntriesByName(measureName)[0]
  console.log(measure.duration)

  // clear all entries by name
  window.performance.clearMarks(startName)
  window.performance.clearMarks(endName)
  window.performance.clearMeasures(measureName)
})
```

---

# npm install nanotiming

```js
var nanotiming = require('nanotiming')

var timing = nanotiming('my-cool-timing')
var i = 1000; while (--i) console.log(i)
timing(function (measure, name) {
  console.log(name + ' took ' + measure.duration + 'ms')
})
```

---

# trace logging
- block up networking as little as possible
- make sure it's always sent
- __always__

---

# sendBeacon

```js
var url = '/log'
var data = { my: 'data' }
var blob = new window.Blob([ JSON.stringify(data) ])
var ok = window.navigator.sendBeacon(url, blob)
console.log('data queued: ' + ok ? 'OK' : 'NOT OK')
```

---

# nanobeacon

```js
var nanobeacon = require('nanobeacon')

var ok = nanobeacon('/log', { my: 'data' })
console.log('data queued: ' + ok ? 'OK' : 'NOT OK')
```

---

# assertions!

- catch errors in runtime
- turn assumptions into code
- less time spent debugging
- no compile step ⚡️

---

# require('assert')

```js
var assert = require('assert')

function myFunction (a, b) {
  assert.equal(typeof a, 'string', 'my-function: a should be type string')
  assert.equal(typeof b, 'object', 'my-function: b should be type object')
  assert.equal(typeof window, 'object', 'my-function: window should exist in the context')
}
```

---

# Fundamentals are down
# What's next
# What's next
# What's next
# What's next

---

# Universal components!

- DOM diffing
- use those cool fundamentals
- magic support for all frameworks

---

# DOM diffing

- create a new tree of DOM nodes
- change an existing tree to look like the new tree
- cool b/c it's just DOM nodes™

---

# DOM diffing

```js
var nanomorph = require('nanomorph')
var html = require('bel')

var a = html`<body>hi planet</body>`
var b = html`<body>hi grampsterdam</body>`
nanomorph(a, b)

console.log(a.toString())
```

---

# downsides of DOM diffing
- stateful DOM nodes are hard
- single DOM node cannot populate two trees
- no cheating

---

# Nanocomponent

```js
var Nanocomponent = require('nanocomponent')

function MyComponent () {
  Nanocomponent.call(this)
}

Mycomponent._render = function () {
  console.log(this.state)
}

MyComponent.prototype = Object.create(Nanocomponent)
```

---

# But that's no fun
# No fun
# No fun
# No no fun
# No fun

---

# Microcomponent

```js
var microcomponent = require('microcomponent')

var component = microcomponent('MyComponent')
component.on('render', function (props, state) {
})
```

---

# Microcomponent

- DOM diffing
- tracing
- debug logging
- can work with every framework ✨

---

# Nanocomponent-adapters

```js
var toReact = require('nanocomponent-adapters/react')
var microcomponent = require('microcomponent')

var component = microcomponent('MyComponent')
component.on('render', function (props, state) {
})

var reactComponent = toReact(component)
```

---

# Nanocomponent-adapters

- lol, frameworks

---

# [ in case of spare time, insert demos here ]

---

# Thank you
# Thank you
# Thank you
# Thank you
# Thank you

---

## github.com/
## yoshuawuyts/microcomponents-talk
## " "
## twitter.com/yoshuawuyts
## github.com/yoshuawuyts
