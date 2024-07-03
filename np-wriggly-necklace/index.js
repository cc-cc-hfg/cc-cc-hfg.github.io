let shapes = []

function createUnitedShape() {
  const radiusPetal = 20
  const radiusInner = 30
  const numPetals = 8

  const innerCircle = new Path.Circle({
    radius: radiusInner,
    fillColor: "pink",
    center: view.center,
    insert: false,
  })
  const shapes = [innerCircle]

  for (let i = 0; i < numPetals; i++) {
    const outerCircle = new Path.Circle({
      radius: radiusPetal,
      center: view.center.add([0, 30]),
      insert: false,
    })
    outerCircle.pivot = view.center
    outerCircle.rotate((360 / numPetals) * i)

    // Add the shape we created.
    shapes.push(outerCircle)
  }

  const united = uniteAll(shapes)

  united.strokeColor = "black"

  return united
}

function onMouseDrag(event) {
  const circle = new Path.Circle({
    fillColor: "white",
    strokeColor: "black",
    radius: 10,
    center: view.center,
  })
  circle.position = event.point
  shapes.push(circle)
}

function onMouseMove(event) {
  let shape
  if (pressedKey === "a") {
    shape = createUnitedShape()
  } else if (pressedKey === "s") {
    shape = new Path.Circle({
      fillColor: "lightgreen",
      strokeColor: "black",
      radius: 50,
      center: view.center,
    })
  } else if (pressedKey === "d") {
    shape = new Path.Star({
      points: 10,
      fillColor: "pink",
      strokeColor: "black",
      radius1: 15,
      radius2: 50,
      center: view.center,
    })
  } else {
    shape = new Path.Circle({
      center: event.middlePoint,
      radius: event.delta.length / 2,
      strokeColor: "black",
      fillColor: "white",
    })
  }

  shape.position = event.point
  shapes.push(shape)
}

let pressedKey
function onKeyDown(event) {
  pressedKey = event.key
}

function onKeyUp(event) {
  pressedKey = null
}

function onFrame(event) {
  for (let shape of shapes) {
    shape.rotate(3)
    shape.fillColor.hue += 1
  }
}

const pane = new Pane()
pane
  .addButton({
    title: "Export",
  })
  .on("click", function () {
    const svg = project.exportSVG({ asString: true })
    downloadSVGFile("wriggly necklace", svg)
  })
