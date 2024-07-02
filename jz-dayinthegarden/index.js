document.addEventListener("DOMContentLoaded", function () {
  // Request microphone permission
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(function (stream) {
      // Microphone permission granted
      var audioContext = new (window.AudioContext ||
        window.webkitAudioContext)()
      var microphone = audioContext.createMediaStreamSource(stream)
      var analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      var bufferLength = analyser.frequencyBinCount
      var dataArray = new Uint8Array(bufferLength)
      microphone.connect(analyser)

      // Function to get the average volume
      function getAverageVolume(array) {
        var values = 0
        var average

        for (var i = 0; i < array.length; i++) {
          values += array[i]
        }

        average = values / array.length
        return average
      }

      function onFrame(event) {
        analyser.getByteFrequencyData(dataArray)
        var volume = getAverageVolume(dataArray)
        var scaledVolume = (volume / 256) * 30 // Increase sensitivity to volume
      }

      view.onFrame = onFrame

      beeCursor.visible = true
      document.body.style.cursor = "url(" + beeCursor.toDataURL() + "), auto"
    })
    .catch(function (err) {
      console.error("Error accessing the microphone: " + err)
    })
})

// Background and Text Setup
var background = new Path.Rectangle(view.bounds)
var gradient = new Gradient(["#b3ffd9", "#ffffff"], "radial")
var gradientColor = new Color(
  gradient,
  view.bounds.topLeft,
  view.bounds.bottomRight
)
background.fillColor = new Color(gradientColor)

var textItem = new PointText({
  content: "please speak to the grass",
  point: new Point(230, 20),
  fillColor: "#00ff00",
  size: 3,
})
textItem.scale(2)

const params = {
  amplitude: 6.56,
  step: 12,
  density: 0.5,
  offset: 0,
  selected: false,
}

function createWobbly(input, { step }) {
  const skeleton = new Path({ insert: false })
  const steps = Math.round(input.length / step)
  const adjustedStep = input.length / steps
  for (let i = 0; i < steps; i++) {
    const offset = i * adjustedStep
    const point = input.getPointAt(offset)
    skeleton.add(point)
  }

  const path = input.clone()
  project.activeLayer.addChild(path)
  path.segments = skeleton.segments
  path.selected = params.selected

  const normals = []
  for (const segment of skeleton.segments) {
    const offset = skeleton.getOffsetOf(segment.point)
    const tangent = skeleton.getTangentAt(offset)
    const orthogonal = tangent.rotate(-90)
    normals.push(orthogonal)
  }

  function update(options) {
    const fullCircle = Math.PI * 2
    const wave =
      Math.round((skeleton.length * options.density) / fullCircle) * fullCircle

    for (let i = 0; i < skeleton.segments.length; i++) {
      const segment = skeleton.segments[i]
      const normal = normals[i]

      const progress = i / skeleton.segments.length
      const x = wave * progress

      const point =
        segment.point +
        normal * Math.sin(x + options.offset) * options.amplitude
      path.segments[i].point = point
    }

    path.smooth({ type: "continuous" })
  }

  return { path, update }
}

const path = new Path.Star({
  fillColor: "yellow",
  points: 10,
  center: [1200, 200],
  radius1: 50,
  radius2: 100,
  insert: false,
  selected: false,
})
path.smooth() // Round the star shape

let wobbly = createWobbly(path, params)
wobbly.update(params)

// Set up the basic parameters
var numBlades = 10
var bladeWidth = 200 // Reduced the width to make individual blades more visible
var bladeHeight = 350
var wobbleSpeed = 0.05
var wobbleAmplitude = 5

// Function to create a single blade of grass with more control points
function createBlade(x, y, width, height) {
  var topPoint = new Point(x, y - height)
  var controlPoint1 = new Point(x - width / 5, y - height / 5)
  var controlPoint2 = new Point(x + width / 5, y - height / 2)
  var bottomLeft = new Point(x - width / 2, y)
  var bottomRight = new Point(x + width / 2, y)

  var path = new Path()
  path.add(bottomLeft)
  path.add(controlPoint1)
  path.add(topPoint)
  path.add(controlPoint2)
  path.add(bottomRight)

  path.closed = true
  path.fillColor = "#00FA26"

  return path
}

// Create the grass blades
var grassBlades = []
for (var i = 0; i < numBlades; i++) {
  var x = (view.size.width / numBlades) * i
  var y = view.size.height
  var bladeHeightRandom = bladeHeight + (Math.random() - 0.5) * 50 // Adding randomness to height
  var blade = createBlade(x, y, bladeWidth, bladeHeightRandom)
  grassBlades.push(blade)
}

// Set up the Web Audio API for microphone input
navigator.mediaDevices
  .getUserMedia({ audio: true, video: false })
  .then(function (stream) {
    var audioContext = new (window.AudioContext || window.webkitAudioContext)()
    var microphone = audioContext.createMediaStreamSource(stream)
    var analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    var bufferLength = analyser.frequencyBinCount
    var dataArray = new Uint8Array(bufferLength)
    microphone.connect(analyser)

    // Function to get the average volume
    function getAverageVolume(array) {
      var values = 0
      var average

      for (var i = 0; i < array.length; i++) {
        values += array[i]
      }

      average = values / array.length
      return average
    }

    // Function to update the grass blades and the star
    function onFrame(event) {
      analyser.getByteFrequencyData(dataArray)
      var volume = getAverageVolume(dataArray)
      var scaledVolume = (volume / 256) * wobbleAmplitude // Scale the volume to fit wobble amplitude

      // Update the star wobble
      params.offset += 0.1
      params.amplitude = scaledVolume // Use volume to control amplitude
      wobbly.update(params)

      // Update the star position based on volume
      var starOffsetX = Math.sin(event.time * wobbleSpeed) * scaledVolume * 50 // Adjust multiplier for movement range
      var starOffsetY = Math.cos(event.time * wobbleSpeed) * scaledVolume * 50 // Adjust multiplier for movement range
      path.position.x = 1200 + starOffsetX
      path.position.y = 200 + starOffsetY

      // Update the grass blades
      for (var i = 0; i < grassBlades.length; i++) {
        var blade = grassBlades[i]
        var wobbleOffset = Math.sin(event.time * wobbleSpeed + i) * scaledVolume

        // Apply wobble to control points for more organic movement
        blade.segments[1].point.x += wobbleOffset
        blade.segments[3].point.x += wobbleOffset

        blade.smooth({ type: "continuous" }) // Smoothing the path
      }
    }

    // Attach the onFrame function to the view
    view.onFrame = onFrame

    // Center the view on resize
    view.onResize = function () {
      for (var i = 0; i < grassBlades.length; i++) {
        grassBlades[i].position.y = view.size.height
      }
    }
  })
  .catch(function (err) {
    console.error("Error accessing the microphone: " + err)
  })

// Load the first stem SVG
var stemSymbol1
project.importSVG("stem.svg", function (item) {
  stemSymbol1 = new Symbol(item)
  console.log("Stem SVG 1 loaded.")
  addStem1() // Ensure stem 1 is added after loading
})

// Load the second stem SVG
var stemSymbol2
project.importSVG("stem2.svg", function (item) {
  stemSymbol2 = new Symbol(item)
  console.log("Stem SVG 2 loaded.")
  addStem2() // Ensure stem 2 is added after loading
})

var stemInstance1, stemInstance2

// Add the first stem SVG instance
function addStem1() {
  if (stemSymbol1) {
    stemInstance1 = stemSymbol1.place(view.center)
    stemInstance1.scale(1.1)
    stemInstance1.position = new Point(
      view.bounds.width / 2 - 400,
      view.bounds.height / 2 + 240
    )
    stemInstance1.bringToFront() // Ensure stem 1 is on top
    console.log("Stem 1 added at:", stemInstance1.position)
    addBlossom1() // Add blossom for stem 1
  } else {
    console.log("Stem 1 symbol is not loaded yet.")
  }
}

// Add the second stem SVG instance
function addStem2() {
  if (stemSymbol2) {
    stemInstance2 = stemSymbol2.place(view.center)
    stemInstance2.scale(0.7)
    stemInstance2.position = new Point(
      view.bounds.width / 2 + 250,
      view.bounds.height / 2 + 240
    )
    stemInstance2.bringToFront() // Ensure stem 2 is on top
    console.log("Stem 2 added at:", stemInstance2.position)
    addBlossom2() // Add blossom for stem 2
  } else {
    console.log("Stem 2 symbol is not loaded yet.")
  }
}

// Load the first blossom SVG
var blossomSymbol1
project.importSVG("blossom.svg", function (item) {
  blossomSymbol1 = new Symbol(item)
  console.log("Blossom SVG 1 loaded.")
  addBlossom1() // Try adding blossom 1 if it's loaded now
})

// Load the second blossom SVG
var blossomSymbol2
project.importSVG("blossom3.svg", function (item) {
  blossomSymbol2 = new Symbol(item)
  console.log("Blossom SVG 2 loaded.")
  addBlossom2() // Try adding blossom 2 if it's loaded now
})

var blossomInstance1, blossomInstance2

// Add the first blossom SVG instance
function addBlossom1() {
  if (blossomSymbol1 && stemInstance1) {
    blossomInstance1 = blossomSymbol1.place(stemInstance1.bounds.topCenter)
    blossomInstance1.scale(1.1)
    blossomInstance1.position.y -= 50 // Adjust as necessary
    blossomInstance1.position.x -= 50
    blossomInstance1.bringToFront() // Ensure blossom 1 is on top
    console.log("Blossom 1 added at:", blossomInstance1.position)

    // Add hover event to rotate the blossom
    blossomInstance1.onMouseEnter = function () {
      this.tween({ rotation: 0 }, { rotation: 10000 }, { duration: 80000 })
    }
  } else {
    console.log(
      "Blossom 1 symbol is not loaded yet or stem 1 instance is not ready."
    )
  }
}

// Add the second blossom SVG instance
function addBlossom2() {
  if (blossomSymbol2 && stemInstance2) {
    blossomInstance2 = blossomSymbol2.place(stemInstance2.bounds.topCenter)
    blossomInstance2.scale(0.4)
    blossomInstance2.position.y -= 50 // Adjust as necessary
    blossomInstance2.position.x -= 50
    blossomInstance2.bringToFront() // Ensure blossom 2 is on top
    console.log("Blossom 2 added at:", blossomInstance2.position)

    // Add hover event to rotate the blossom
    blossomInstance2.onMouseEnter = function () {
      this.tween({ rotation: 0 }, { rotation: 10000 }, { duration: 80000 })
    }
  } else {
    console.log(
      "Blossom 2 symbol is not loaded yet or stem 2 instance is not ready."
    )
  }
}

// Wait for the DOM to be ready
document.addEventListener("DOMContentLoaded", function () {
  // Load the SVG path data from your cloud.svg file
  var svgPath = new paper.Path()
  paper.project.importSVG("cloud.svg", {
    onLoad: function (item) {
      // Once SVG is loaded, position it at the top left corner
      svgPath = item
      svgPath.position = new paper.Point(0, svgPath.bounds.height / 2)

      // Define the animation function
      function onFrame(event) {
        // Move the SVG horizontally across the canvas
        svgPath.position.x += 2 // Adjust speed as needed

        // Reset position when it moves out of view on the right
        if (
          svgPath.position.x >
          paper.view.bounds.width + svgPath.bounds.width / 2
        ) {
          svgPath.position.x = -svgPath.bounds.width / 2
        }
      }

      // Run the animation loop
      paper.view.onFrame = onFrame
    },
  })
})
