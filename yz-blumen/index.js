//Yunfei Zhang

//background
let rect = new Path.Rectangle({
  point: [0, 0],
  size: [view.size.width / 0.1, view.size.height / 0.1],
  strokeColor: "green",
  fillColor: "rgb(130,176,37)",
})
rect.sendToBack()

const path = new Path({ strokeColor: "rgb(228,249,142)", strokeWidth: 25 })
path.segments = [
  [500, 40],
  [400, 200],
  [270, 300],
  [245, 400],
]
path.smooth({ type: "continuous" })

//  const numStems = 7
// for (let i = 0; i < numStems; i++) {
//    const offset = (path.length / numStems) * i
//    const point = path.getPointAt(offset)
//    const tangent = path.getTangentAt(offset)

//   const isEven = i % 3 === 0
//    const rotation = isEven ? 50 : -63
//    const vector = tangent.rotate(rotation).multiply(70)

//    const stem = new Path({
//      strokeColor: "rgb(102,204,0)",
//      strokeWidth: 5,
//    })
//    stem.segments = [point, point.add(vector)]

//    const Circle = new Path.Circle({
//      radius: 8,
//      fillColor: "rgb(204, 0, 0)",
//      center: point.add(vector),
//    })
//  }

const group0 = new Group([path])
group0.remove()

// -- Curved path 路径花瓣1
const pathCurved1 = new Path({
  strokeColor: "black",
  strokeWidth: 4,
})
pathCurved1.segments = [
  { point: [200, 380], handleOut: [-20, -30] },
  { point: [250, 350], handleIn: [-80, -80], handleOut: [10, -20] },
  { point: [300, 380], handleIn: [-10, -70], handleOut: [-20, -20] },
  { point: [250, 370], handleIn: [1, 1], handleOut: [-20, -20] },
]
pathCurved1.closed = true
////// 花瓣2
const pathCurved2 = new Path({
  strokeColor: "black",
  strokeWidth: 5,
})
pathCurved2.segments = [
  { point: [175, 330], handleOut: [0, -30] },
  { point: [200, 260], handleIn: [-30, -40], handleOut: [20, 0] },
  { point: [230, 310], handleOut: [-40, -40] },
]
pathCurved2.closed = true
/////路径花瓣3
// -- Curved path
const pathCurved3 = new Path({
  strokeColor: "black",
  strokeWidth: 7,
})
pathCurved3.segments = [
  { point: [245, 325], handleOut: [0, -20] },
  { point: [260, 280], handleIn: [-20, -20], handleOut: [30, -20] },
  { point: [300, 290], handleIn: [30, -20], handleOut: [40, 0] },
  { point: [310, 330], handleOut: [-30, -30] },
]
pathCurved3.closed = true
////花瓣4
const pathCurved4 = new Path({
  strokeColor: "black",
  strokeWidth: 9,
})
pathCurved4.segments = [
  { point: [215, 255], handleOut: [0, -15] },
  { point: [260, 270], handleIn: [0, 0], handleOut: [5, 5] },
  { point: [230, 230], handleIn: [10, 0], handleOut: [-20, -10] },
]
pathCurved4.closed = true

///////////编组group

const group = new Group([pathCurved1, pathCurved2, pathCurved3, pathCurved4])

group.scale(1)
group.rotate(2)

group.fillColor = "red"

group.strokeColor = "blue"
group.blendMode = "screen"

/////////// 旋转
group.pivot = group.bounds.bottomCenter.add({ x: 0, y: 18 })
const centerCircle = new Path.Circle({
  fillColor: "rgb(153,51,255)",
  radius: 20,
  position: group.pivot,
})

const groupAll = new Group([group, group0, centerCircle])

groupAll.remove()

const numTriangles = 8
for (let i = 0; i < numTriangles; i++) {
  const angle = (360 / numTriangles) * i
  const clone = group.clone()
  clone.rotate(angle)
  groupAll.addChild(clone)
  // clone.scale(Math.sin(i * 0.35), clone.bounds.center)
}
// We remove the group to make it invisible. We only want to see the random
// result, not the orgiginal paths.
group.remove()

// The effect function. It expects a path and some options, like `amount` in
// this case.
function randomize(path, { amount }) {
  for (const segment of path.segments) {
    segment.point.x += randomMinMax(-amount, amount)
    segment.point.y += randomMinMax(-amount, amount)
  }
  return path
}

// We use a library called `tweakpane` to build a user interface.
const options = { amount: 5 }

const pane = new Pane()
// Add an input for the `amount` option.
pane.addBinding(options, "amount", { min: 0, max: 200 })
// Each time, something changes in the user interface we want to apply the
// effect again. We do this in the `update()` function.
pane.on("change", update)
// Also add a button to manually update the effect, so we don't have to reload
// the browser.
const button = pane.addButton({ title: "Update" })
button.on("click", update)

let result
function update() {
  // Cleanup the canvas by removing anything we might have drawn previously.
  if (result) result.remove()

  // Apply the `randomize` effect to the whole group. But because we wan't to
  // keep the original group, we clone it first.
  const clone = groupAll.clone()
  result = applyPathEffect(clone, randomize, options)
  // Because the original group isn't visible (we removed it) the result is also
  // invisible, so we have to insert it.
  project.activeLayer.addChild(result)
}

// Run the update function once, so the the screen isn't blank in the beginning.
update()

const synth = new Tone.Synth().toDestination()

tool.minDistance = 100
//Yunfei Zhang
function onMouseDrag(event) {
  const flower = new Group()

  const synth = new Tone.Synth().toDestination()
  const now = Tone.now()
  // trigger the attack immediately
  synth.triggerAttack("D3", now)
  // wait one second before triggering the release
  synth.triggerRelease(now + 1)

  // -- Curved path 路径花瓣1
  const pathCurved1 = new Path({
    strokeColor: "black",
    strokeWidth: 4,
  })
  pathCurved1.segments = [
    { point: [20, 3.8], handleOut: [-20, -30] },
    { point: [2.5, 3.5], handleIn: [-80, -80], handleOut: [10, -20] },
    { point: [3.0, 3.8], handleIn: [-10, -70], handleOut: [-20, -20] },
    { point: [2.5, 3.7], handleIn: [1, 1], handleOut: [-20, -20] },
  ]
  pathCurved1.closed = true
  ////// 花瓣2
  const pathCurved2 = new Path({
    strokeColor: "black",
    strokeWidth: 5,
  })
  pathCurved2.segments = [
    { point: [1.75, 3.3], handleOut: [0, -30] },
    { point: [2.0, 2.6], handleIn: [-30, -40], handleOut: [20, 0] },
    { point: [2.3, 3.1], handleOut: [-40, -40] },
  ]
  pathCurved2.closed = true
  /////路径花瓣3
  // -- Curved path
  const pathCurved3 = new Path({
    strokeColor: "black",
    strokeWidth: 7,
  })
  pathCurved3.segments = [
    { point: [2.45, 3.25], handleOut: [0, -20] },
    { point: [2.6, 2.8], handleIn: [-20, -20], handleOut: [30, -20] },
    { point: [3.0, 2.9], handleIn: [30, -20], handleOut: [40, 0] },
    { point: [3.1, 3.3], handleOut: [-30, -30] },
  ]
  pathCurved3.closed = true
  ////花瓣4
  const pathCurved4 = new Path({
    strokeColor: "black",
    strokeWidth: 9,
  })
  pathCurved4.segments = [
    { point: [2.15, 2.55], handleOut: [0, -15] },
    { point: [2.6, 2.7], handleIn: [0, 0], handleOut: [5, 5] },
    { point: [2.3, 2.3], handleIn: [10, 0], handleOut: [-20, -10] },
  ]
  pathCurved4.closed = true

  ///////////编组group

  const petal = new Group([pathCurved1, pathCurved2, pathCurved3, pathCurved4])
  flower.addChild(petal)

  petal.scale(1)
  petal.rotate(2)

  petal.fillColor = "rgb(22,249,128)"

  petal.strokeColor = "pink"
  petal.blendMode = "screen"

  /////////// 旋转
  petal.pivot = petal.bounds.bottomCenter.add({ x: 0, y: 18 })
  const circle = new Path.Circle({
    fillColor: "rgb(22,249,128)",
    radius: 12,
    position: petal.pivot,
  })
  flower.addChild(circle)

  const numTriangles = 8
  for (let i = 1; i < numTriangles; i++) {
    const angle = (360 / numTriangles) * i
    const clone = petal.clone()
    flower.addChild(clone)
    clone.rotate(angle)
    // clone.scale(Math.sin(i * 0.35), clone.bounds.center)
  }

  flower.position = event.point

  // output.addChild(group)

  // let output = new Path.Circle({
  //   center: event.middlePoint,
  //   radius: event.delta.length / 2
  // });
}

let text = new PointText({
  point: [50, 50],
  content: "Please turn up the volume, click and drag the mouse",
  fillColor: "rgb(242,247,158)",
  fontFamily: "Courier New",
  fontWeight: "bold",
  fontSize: 25,
})

pane
  .addButton({
    title: "Export",
  })
  .on("click", function () {
    const svg = project.exportSVG({ asString: true })
    downloadSVGFile("recolored", svg)
  })
