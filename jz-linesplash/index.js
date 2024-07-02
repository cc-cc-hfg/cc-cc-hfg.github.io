var values = {
  friction: 0.8,
  timeStep: 0.01,
  amount: 15,
  mass: 2,
  count: 0,
}
values.invMass = 1 / values.mass

var path, springs
var size = view.size * [1.2, 1]

var Spring = function (a, b, strength, restLength) {
  this.a = a
  this.b = b
  this.restLength = restLength || 80
  this.strength = strength ? strength : 0.55
  this.mamb = values.invMass * values.invMass
}

Spring.prototype.update = function () {
  var delta = this.b - this.a
  var dist = delta.length
  var normDistStrength =
    ((dist - this.restLength) / (dist * this.mamb)) * this.strength
  delta.y *= normDistStrength * values.invMass * 0.2
  if (!this.a.fixed) this.a.y += delta.y
  if (!this.b.fixed) this.b.y -= delta.y
}

function createPath(strength) {
  var path = new Path({
    fillColor: "#99ccff",
    strokeColor: "blue",
    strokeWidth: 5,
  })
  springs = []
  for (var i = 0; i <= values.amount; i++) {
    var segment = path.add(new Point(i / values.amount, 0.5) * size)
    var point = segment.point
    if (i == 0 || i == values.amount) point.y += size.height
    point.px = point.x
    point.py = point.y
    point.fixed = i < 2 || i > values.amount - 2
    if (i > 0) {
      var spring = new Spring(segment.previous.point, point, strength)
      springs.push(spring)
    }
  }
  path.position.x -= size.width / 4
  return path
}

function onResize() {
  if (path) path.remove()
  size = view.bounds.size * [2, 1]
  path = createPath(0.1)
}

function onMouseMove(event) {
  var location = path.getNearestLocation(event.point)
  var segment = location.segment
  var point = segment.point

  if (!point.fixed && location.distance < size.height / 4) {
    var y = event.point.y
    point.y += (y - point.y) / 6
    if (segment.previous && !segment.previous.fixed) {
      var previous = segment.previous.point
      previous.y += (y - previous.y) / 24
    }
    if (segment.next && !segment.next.fixed) {
      var next = segment.next.point
      next.y += (y - next.y) / 24
    }
  }
}

function onFrame(event) {
  updateWave(path)
  moveSVGs(event)
  moveAboveWaveSVG(event) // Ensure this is called on each frame
  rotateStaticSVG(event)
}

function updateWave(path) {
  var force = 1 - values.friction * values.timeStep * values.timeStep
  for (var i = 0, l = path.segments.length; i < l; i++) {
    var point = path.segments[i].point
    var dy = (point.y - point.py) * force
    point.py = point.y
    point.y = Math.max(point.y + dy, 0)
  }

  for (var j = 0, l = springs.length; j < l; j++) {
    springs[j].update()
  }
  path.smooth({ type: "continuous" })
}

function onKeyDown(event) {
  if (event.key == "space") {
    path.fullySelected = !path.fullySelected
    path.fillColor = path.fullySelected ? null : "black"
  }
}

// Load SVG and create a symbol from it
var svgSymbol, svgSymbol2
project.importSVG("fishy.svg", function (item) {
  svgSymbol = new Symbol(item)
})

// Load the second SVG and create a symbol from it
project.importSVG("fishy2.svg", function (item) {
  svgSymbol2 = new Symbol(item)
})

// Load the bird SVG and create a symbol from it
var birdSymbol
project.importSVG("birb.svg", function (item) {
  birdSymbol = new Symbol(item)
})

// Function to move the SVGs along the wave
var svgInstance, svgInstance2
function moveSVGs(event) {
  if (!svgInstance && svgSymbol) {
    svgInstance = svgSymbol.place(path.segments[0].point)
    svgInstance.scale(0.5) // Scale the SVG to fit better
  }
  if (!svgInstance2 && svgSymbol2) {
    svgInstance2 = svgSymbol2.place(path.segments[0].point)
    svgInstance2.scale(0.4) // Scale the SVG to fit better
  }
  if (svgInstance && svgInstance2) {
    var segmentCount = path.segments.length
    var time = (event.time * 2) % segmentCount
    var index = Math.floor(time)
    var nextIndex = (index + 1) % segmentCount
    var segment = path.segments[index].point
    var nextSegment = path.segments[nextIndex].point

    // Interpolate between the two points for the first SVG
    var t = time - index
    var x1 = segment.x * (1 - t) + nextSegment.x * t
    var y1 = segment.y * (1 - t) + nextSegment.y * t + 100

    svgInstance.position = new Point(x1, y1)

    // Interpolate between the two points for the second SVG with an offset
    var offsetTime = (event.time * 2 + 3) % segmentCount // Slight offset for the second SVG
    var offsetIndex = Math.floor(offsetTime)
    var nextOffsetIndex = (offsetIndex + 1) % segmentCount
    var offsetSegment = path.segments[offsetIndex].point
    var nextOffsetSegment = path.segments[nextOffsetIndex].point

    var tOffset = offsetTime - offsetIndex
    var x2 = offsetSegment.x * (1 - tOffset) + nextOffsetSegment.x * tOffset
    var y2 =
      offsetSegment.y * (1 - tOffset) + nextOffsetSegment.y * tOffset + 100

    svgInstance2.position = new Point(x2, y2)
  }
}

var birdInstance
function moveAboveWaveSVG(event) {
  if (!birdInstance && birdSymbol) {
    birdInstance = birdSymbol.place(new Point(view.size.width + 50, 100))
    birdInstance.scale(0.3)
  }
  if (birdInstance) {
    birdInstance.position.x -= 6
    if (birdInstance.position.x < -50) {
      birdInstance.position.x = view.size.width + 50
    }
  }
}

// Load the static SVG and create a symbol from it
var staticSymbol
project.importSVG("starfish.svg", function (item) {
  staticSymbol = new Symbol(item)
  addStaticSVG() // Ensure static SVG is added after loading
})

// Add static SVG above the gras.svg and rotate it
var staticInstance
function addStaticSVG() {
  if (staticSymbol) {
    staticInstance = staticSymbol.place(view.center)
    staticInstance.scale(0.5)
    staticInstance.position = new Point(
      view.bounds.width / 2 - 450,
      view.bounds.height / 2 + 150
    )
    staticInstance.bringToFront() // Ensure static SVG is on top
  } else {
    console.log("Static symbol is not loaded yet.")
  }
}

function rotateStaticSVG(event) {
  if (staticInstance) {
    staticInstance.rotate(1) // Rotate by 2 degrees on each frame
  }
}

var background = new Path.Rectangle(view.bounds)
var gradient = new Gradient(["#b3d9ff", "#ffffff"], "radial")
var gradientColor = new Color(
  gradient,
  view.bounds.topLeft,
  view.bounds.bottomRight
)
background.fillColor = {
  gradient: gradient,
  origin: view.bounds.topLeft,
  destination: view.bounds.bottomRight,
}

var textItem = new PointText({
  content: "A DAY WITH THE FISH & FRIENDS",
  point: new Point(230, 20),
  fillColor: "blue",
})

view.onResize = onResize
view.onMouseMove = onMouseMove
view.onFrame = onFrame
view.onKeyDown = onKeyDown

// Load the overlay SVG and create a symbol from it
var overlaySymbol
project.importSVG("gras.svg", function (item) {
  overlaySymbol = new Symbol(item)
  addOverlay() // Ensure overlay is added after loading
})

// Add overlay SVG to fill the entire width of the screen
var overlayInstance
function addOverlay() {
  if (overlaySymbol) {
    overlayInstance = overlaySymbol.place(view.center)
    var scaleFactor = view.size.width / overlayInstance.bounds.width
    overlayInstance.scale(scaleFactor)
    overlayInstance.position = view.center
    overlayInstance.position.y = view.bounds.height / 2
    overlayInstance.bringToFront() // Ensure overlay is on top
  } else {
    console.log("Overlay symbol is not loaded yet.")
  }
}

view.onFrame = function (event) {
  onFrame(event)
  if (!overlayInstance && overlaySymbol) {
    addOverlay()
  }
}

onResize()
