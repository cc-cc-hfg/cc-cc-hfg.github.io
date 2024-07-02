function fitFaceToPoints(face, points, scale) {
  // Create a rectangle around the four points.
  const [p1, p2, p3, p4] = points
  var minX = Math.min(p1.x, p2.x, p3.x, p4.x)
  var minY = Math.min(p1.y, p2.y, p3.y, p4.y)
  var maxX = Math.max(p1.x, p2.x, p3.x, p4.x)
  var maxY = Math.max(p1.y, p2.y, p3.y, p4.y)
  const bounds = new Rectangle({ from: [minX, minY], to: [maxX, maxY] })

  // Scale the rectangle.
  const scaledBounds = bounds.scale(scale)

  // For debugging you can draw a red rectangle for the new bounds of the face:
  // new Path.Rectangle({ rectangle: scaledBounds, strokeColor: "red" })

  // Fit the face into the bounds of the four points.
  face.fitBounds(scaledBounds)
}

function fitFaces() {
  // Face 1
  fitFaceToPoints(
    face1,
    [
      castle.segments[9].point,
      castle.segments[10].point,
      castle.segments[14].point,
      castle.segments[15].point,
    ],
    0.5
  )

  // Face 2
  fitFaceToPoints(
    face2,
    [
      castle.segments[2].point,
      castle.segments[3].point,
      castle.segments[7].point,
      castle.segments[8].point,
    ],
    0.5
  )

  // Face 3
  fitFaceToPoints(
    face3,
    [
      castle.segments[17].point,
      castle.segments[21].point,
      castle.segments[16].point,
      castle.segments[22].point,
    ],
    0.2
  )
}

let castle, face1, face2, face3
project.importSVG("castle.svg", function (svg) {
  face1 = svg.children["face1"]
  face2 = svg.children["face2"]
  face3 = svg.children["face3"]

  castle = svg.children["castle"]
  castle.fillColor = "pink"

  for (const segment of castle.segments) {
    const circle = new Path.Circle({
      radius: 8,
      center: segment.point,
      fillColor: "black",
    })

    // For debugging your can display the segment indexes next to the circle.
    // This allows you to find the 4 circles which you want to use to align
    // the faces.
    const text = new PointText({
      content: segment.index,
      position: segment.point + [16, 16],
    })

    circle.on("mousedrag", function (event) {
      segment.point = event.point
      circle.position = event.point
      text.position = event.point + [16, 16]
      fitFaces()
    })
  }

  fitFaces()
})

// The parameters that we want to change with tweakpane.
const params = {
  file: "",
  color: "rgb(255, 0, 0)",
}

// Create a new tweakpane and redraw the circle each time we change the
// parameters.
const pane = new Pane()
pane.registerPlugin(TweakpaneFileImportPlugin)

// Here we will store our imported SVG.
let importedSVG

pane.addBinding(params, "color")

// Export
pane
  .addButton({
    title: "Export",
  })
  .on("click", function () {
    const svg = project.exportSVG({ asString: true })
    downloadSVGFile("recolored", svg)
  })

pane.on("change", function () {
  // If we have already imported something, we will recolor it every time we
  // change the color in tweakpane.
  if (castle) {
    castle.fillColor = params.color
  }
})
