// Drag and drop Matrix

var values = {
  amount: 80, // Adjusting the number of characters to fit the larger font size
}

window.setInterval(() => console.log("fu"), 1000)

var raster, group
var count = 0
var matrixChars = "dewi"

view.element.style.backgroundColor = "black"

handleImage("mona")

var text = new PointText({
  point: view.center,
  justification: "center",
  fillColor: "white",
  fontSize: 15,
  content: window.FileReader
    ? "Drag & drop an image from your desktop"
    : "To drag & drop images, please use Webkit, Firefox, Chrome or IE 10",
})

function createMatrixPiece() {
  var textItem = new PointText({
    point: view.center,
    content: matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)),
    fillColor: "green",
    fontSize: 20, // Increased font size
  })
  return textItem
}

function handleImage(image) {
  count = 0

  if (group) group.remove()

  raster = new Raster(image)
  raster.visible = false
  raster.on("load", function () {
    raster.fitBounds(view.bounds, true)
    group = new Group()
    var spacing = view.bounds.width / values.amount
    for (var y = 0; y < values.amount; y++) {
      for (var x = 0; x < values.amount; x++) {
        var copy = createMatrixPiece()
        copy.position = new Point(x * spacing, y * spacing)
        group.addChild(copy)
      }
    }
    group.fitBounds(view.bounds, true)
    group.scale(1.1)
  })
}

function onFrame(event) {
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

function onDocumentDrag(event) {
  event.preventDefault()
}

function onDocumentDrop(event) {
  event.preventDefault()

  var file = event.dataTransfer.files[0]
  var reader = new FileReader()

  reader.onload = function (event) {
    var image = document.createElement("img")
    image.onload = function () {
      handleImage(image)
      view.draw()
    }
    image.src = event.target.result
  }
  reader.readAsDataURL(file)
}

document.addEventListener("drop", onDocumentDrop, false)
document.addEventListener("dragover", onDocumentDrag, false)
document.addEventListener("dragleave", onDocumentDrag, false)

const pane = new Pane()

pane
  .addButton({
    title: "Export",
  })
  .on("click", function () {
    const svg = project.exportSVG({ asString: true })
    downloadSVGFile("circle gradient mouse click", svg)
  })
