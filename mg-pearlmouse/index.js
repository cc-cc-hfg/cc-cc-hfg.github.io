const radiusPetal = 100
const radiusInner = 50
const numPetals = 5

const innerCircle = new Path.Circle({
  radius: radiusInner,
  fillColor: "blue",
  center: view.center,
  insert: false,
})

// We have to make a list of all the shapes that we want to unite.
// Let's start with the inner circle.
const shapes = [innerCircle]

for (let i = 0; i < numPetals; i++) {
  const outerCircle = new Path.Circle({
    radius: radiusPetal,
    fillColor: "blue",
    center: view.center.add([0, 100]),
    insert: false,
  })
  outerCircle.pivot = view.center
  outerCircle.rotate((360 / numPetals) * i)

  // Add the shape we created.
  shapes.push(outerCircle)
}

const flower = uniteAll(shapes)
flower.strokeColor = "blue"
flower.fillColor = "transparent"
flower.remove()

project.currentStyle.fillColor = "black"

tool.fixedDistance = 30

tool.minDistance = 50

function onMouseMove(event) {
  const clone = flower.clone()
  project.activeLayer.addChild(clone)
  clone.position = event.point
}
