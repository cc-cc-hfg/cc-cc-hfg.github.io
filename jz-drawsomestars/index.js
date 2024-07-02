tool.maxDistance = 10

var textItem = new PointText({
  content: "drawsomestars",
  point: new Point(230, 20),
  fillColor: "rgb(0,255,17",
})

textItem.scale(2, 1)

function onMouseDrag(event) {
  var circle = new Path.Star({
    points: 4,

    center: event.middlePoint,
    radius1: event.delta.length * 2,
    radius2: event.delta.length * 10,
  })
  circle.fillColor = params.fillColor
  circle.strokeWidth = params.strokeWidth
  circle.strokeColor = params.strokeColor

  circle.shadowColor = params.shadowColor
  // Set the shadow blur radius to 12:
  circle.shadowBlur = 40
  // Offset the shadow by { x: 5, y: 5 }
  circle.shadowOffset = new Point(5, 5)

  circle.scale(params.scale, 1)
  circle.skew(params.skew, 1)
}

const params = {
  fillColor: "rgb(220, 151, 255)",
  selected: false,
  strokeColor: "rgb(255, 255, 255)",
  center: view.center.clone(),
  strokeWidth: 1,
  shadowColor: "rgb(0, 255, 17)",
  scale: 1,
  skew: 50,
}

function draw() {
  // Cleanup the previously drawn circle.
}
// Draw the circle the first time.
draw()

// Create a new tweakpane and redraw the circle each time we change the
// parameters.
const pane = new Pane()
pane.addBinding(params, "fillColor")

pane.addBinding(params, "strokeColor")
pane.addBinding(params, "strokeWidth", { min: 1, max: 200 })
pane.addBinding(params, "shadowColor")
pane.addBinding(params, "scale", { min: 0.5, max: 5 })
pane.addBinding(params, "skew", { min: 0.5, max: 100 })
pane.on("change", draw)
