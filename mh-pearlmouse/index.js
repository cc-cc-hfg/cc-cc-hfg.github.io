// Pearl mouse
tool.fixedDistance = 30

function onMouseMove(event) {
  var circle = new Path.Circle({
    center: event.middlePoint,

    radius: event.delta.length / 2,
  })

  var gradient = new Gradient({
    stops: [
      ["#FFD2D2", 0.2],
      ["#FFD2FF", 0.5],
      ["#D2D2FF", 0.8],
    ],

    radial: true,
  })

  var from = circle.bounds.topLeft

  var to = circle.bounds.bottomRight

  var gradientColor = new Color(gradient, from, to)

  circle.fillColor = gradientColor
}

const pane = new Pane()
pane
  .addButton({
    title: "Export",
  })
  .on("click", function () {
    const svg = project.exportSVG({ asString: true })
    downloadSVGFile("recolored", svg)
  })
