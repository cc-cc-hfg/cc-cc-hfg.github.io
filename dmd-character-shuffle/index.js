//character shuffle (2024)

// The parameters that we want to change with Tweakpane.
const params = {
  fontSize: 50,
  amount: 30,
}

// Create a new Tweakpane and redraw the matrix each time we change the parameters.
const pane = new Pane()
pane.addBinding(params, "fontSize", { min: 10, max: 100 })
pane.addBinding(params, "amount", { min: 10, max: 100 })
// pane.on("change", handleImage)

const video = document.querySelector("#video")
const videoStill = document.querySelector("#video-still")
const videoStillContext = videoStill.getContext("2d")

const path = new Path({ strokeColor: "blue", strokeWidth: 10, selected: true })

let started = false
let text

// Initialize the text
text = new PointText({
  point: view.center,
  justification: "center",
  fillColor: "white",
  fontSize: 15,
  content: window.FileReader
    ? "Double click to start"
    : "To drag & drop images, please use Webkit, Firefox, Chrome or IE 10",
})

async function start() {
  // Only run this function once.
  if (started) return

  const stream = await navigator.mediaDevices.getUserMedia({ video: true })

  video.srcObject = stream
  // video.play()

  started = true

  // Remove the text if it still exists
  if (text) {
    text.remove()
    text = null
  }
}

function updateVideoStill() {
  // Place a still of the video in the video-still canvas.
  videoStillContext.drawImage(video, 0, 0, videoStill.width, videoStill.height)

  handleImage(videoStill)
}

function onMouseDown(event) {
  if (event.event.detail === 2) {
    // Check if it's a double-click
    // Request video access.
    start()

    // Remove the text
    if (text) {
      text.remove()
      text = null
    }
  }
}

var raster, group
var count = 0
var matrixChars = "01Dewi"

view.element.style.backgroundColor = "black"

function createMatrixPiece() {
  return new PointText({
    point: view.center,
    content: matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)),
    fillColor: "green",
    fontSize: params.fontSize,
  })
}

function handleImage(image) {
  count = 0

  if (group) group.remove()
  if (raster) raster.remove()

  raster = new Raster(image)
  raster.visible = false

  raster.fitBounds(view.bounds, true)
  group = new Group()
  var spacing = view.bounds.width / params.amount
  for (var y = 0; y < params.amount; y++) {
    for (var x = 0; x < params.amount; x++) {
      var piece = createMatrixPiece()
      piece.position = new Point(x * spacing, y * spacing)
      group.addChild(piece)
    }
  }
  group.fitBounds(view.bounds, true)
  group.scale(1.1)
}

function onFrame(event) {
  updateVideoStill()

  if (!group) return

  for (var i = 0; i < group.children.length; i++) {
    var piece = group.children[i]
    piece.position.y += 2
    if (piece.position.y > view.bounds.height) {
      piece.position.y = 0
      piece.content = matrixChars.charAt(
        Math.floor(Math.random() * matrixChars.length)
      )
    }
    var rasterColor = raster.getAverageColor(piece.position)
    if (rasterColor) {
      piece.fillColor = rasterColor
    }
  }
}

function onResize() {
  project.activeLayer.position = view.center
}

// Export
// pane
//   .addButton({
//     title: "Export",
//   })
//   .on("click", function () {
//     const svg = project.exportSVG({ asString: true })
//     downloadSVGFile("character_shuffle", svg)
//   })

// pane.on("change", function () {
//   // If we have already imported something, we will recolor it every time we
//   // change the color in tweakpane.
//   if (importedSVG) {
//     importedSVG.fillColor = params.color
//   }
// })
