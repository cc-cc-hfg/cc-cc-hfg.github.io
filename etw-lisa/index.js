//lisa
project.currentStyle.fillColor = "black"

tool.fixedDistance = 30

function onMouseDrag(event) {
  var circle = new Path.Circle({
    center: event.middlePoint,
    radius: params.radius,
  })
  circle.fillColor = params.fillColor
  circle.strokeColor = params.strokeColor
  circle.strokeWidth = params.strokeWidth
}

const circle = new Path.Circle({
  radius: 100,
  fillColor: "yellow",
  position: [400, 300],
})

const circle4 = new Path.Circle({
  radius: 30,
  fillColor: "white",
  position: [350, 300],
})

const circle5 = new Path.Circle({
  radius: 30,
  fillColor: "white",
  position: [300, 300],
})

const circle2 = new Path.Circle({
  radius: 15,
  fillColor: "black",
  position: [350, 300],
})
const circle3 = new Path.Circle({
  radius: 15,
  fillColor: "black",
  position: [300, 300],
})

const circle6 = new Path.Circle({
  radius: 15,
  fillColor: "red",
  position: [350, 350],
})

const triangle = new Path.RegularPolygon({
  center: [400, 530],
  sides: 3,
  radius: 120,
  fillColor: "red",
})

const params = {
  fillColor: "rgb(255,0,0)",
  strokeColor: "rgb(0,0,0)",
  strokeWidth: 1,
  radius: 30,
}

function draw() {}

draw()

const pane = new Pane()
pane.addBinding(params, "fillColor")
pane.addBinding(params, "strokeColor")
pane.addBinding(params, "strokeWidth", { min: 0, max: 50 })
pane.addBinding(params, "radius", { min: 0, max: 50 })
pane.on("change", draw)
