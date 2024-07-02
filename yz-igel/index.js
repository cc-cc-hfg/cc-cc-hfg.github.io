//background //Yunfei Zhang
let rect = new Path.Rectangle({
  point: [0, 0],
  size: [view.size.width / 0.1, view.size.height / 0.1],
  strokeColor: "green",
  fillColor: "rgb(41,25,13)",
})
rect.sendToBack()

////apfel

let myPath

function onMouseDown(event) {
  myPath = new Path({ strokeColor: "rgb(191,247,158)", strokeWidth: 1 })
}

function onMouseDrag(event) {
  myPath.add(event.point)
}

function onMouseUp(event) {
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 1; j++) {
      let myCircle = new Path.Circle({
        radius: 10,
        center: event.point,
      })

      myCircle.pivot = [260, 335]
      myCircle.rotate((360 / 10) * i)
      myCircle.rotate(j * i * 1)

      myCircle.strokeColor = "rgb(22,249,128)"
      myCircle.fillColor = "red"
      myCircle.blendMode = "screen"
    }
  }
}

//Igel
const Circle = new Path.Star({
  points: 48,
  fillColor: "rgb(255,255,209)",
  radius1: 26,
  radius2: 100,
  center: [260, 335],
})

const body = new Path.Star({
  points: 90,
  center: [275, 355],
  radius1: 60,
  radius2: 40,
  fillColor: "rgb(252,249,228)",
})

//Augen
const circleL = new Path.Circle({
  radius: 3,
  fillColor: "black",
  position: [290, 360],
})

const circleR = new Path.Circle({
  radius: 3,
  fillColor: "black",
  position: [305, 370],
})

//Nase
const circleN = new Shape.Ellipse({
  radius: [4, 3],
  strokeColor: "green",
  fillColor: "pink",
  position: [300, 380],
})

//Hand
const pathCurvedL = new Path({
  strokeColor: "black",
  strokeWidth: 1,
})
pathCurvedL.segments = [
  { point: [265, 368], handleOut: [-10, 10] },
  { point: [266, 376], handleIn: [10, -10], handleOut: [0, 0] },
  { point: [260, 375] },
]

const Igel = new Group([Circle, body, circleL, circleR, circleN, pathCurvedL])

// Note: this is needed if we want to tween the `rotation` property.

// Animate the Path when we click it.
Igel.on("click", function () {
  Igel.tween(
    // The new properties the path will be be tweened into.
    {
      rotation: Igel.rotation + 90,
      "position.x": randomMinMax(50, view.bounds.width - 100),
      applyMatrix: false,
    },
    // Options:
    // - duration: how long does the tween take
    // - easing: can be one of the following: "linear", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint"
    {
      duration: 700,
      easing: "easeInOutCubic",
    }
  )
})

// Add a small hint.
// new PointText({
//   content: "Click on the rectangle",
//   position: [100, 50],
// })

let text = new PointText({
  point: [50, 50],
  content: "Please click and drag the mouse or click the hedgehog",
  fillColor: "rgb(242,247,158)",
  fontFamily: "Courier New",
  fontWeight: "bold",
  fontSize: 25,
})
