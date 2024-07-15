// Uncatchable Fly

function createFly() {
  const position = new Point(
    randomMinMax(50, view.bounds.width - 50),
    randomMinMax(50, view.bounds.height - 50)
  )

  const base = new Path.Ellipse({
    center: position,
    size: [300, 300],
    fillColor: "blue",
    strokeColor: "black",
    opacity: 0,
  })

  const body = new Path.Ellipse({
    center: position,
    size: [40, 60],
    fillColor: "gray",
    strokeColor: "black",
  })

  const head = new Path.Circle({
    center: new Point(position.x, position.y - 30),
    radius: 20,
    fillColor: "black",
  })

  const leftEye = new Path.Circle({
    center: new Point(position.x - 15, position.y - 35),
    radius: 5,
    fillColor: "white",
  })

  const rightEye = new Path.Circle({
    center: new Point(position.x + 15, position.y - 35),
    radius: 5,
    fillColor: "white",
  })

  function createLeg(start, end) {
    return new Path({
      segments: [start, end],
      strokeColor: "black",
      strokeWidth: 1.5,
    })
  }

  const legs = [
    createLeg(
      new Point(position.x - 15, position.y),
      new Point(position.x - 30, position.y + 30)
    ),
    createLeg(
      new Point(position.x - 5, position.y + 10),
      new Point(position.x - 25, position.y + 45)
    ),
    createLeg(
      new Point(position.x + 5, position.y + 15),
      new Point(position.x + 25, position.y + 43)
    ),
    createLeg(
      new Point(position.x + 15, position.y + 10),
      new Point(position.x + 30, position.y + 30)
    ),
    createLeg(
      new Point(position.x - 15, position.y - 10),
      new Point(position.x - 30, position.y - 50)
    ),
    createLeg(
      new Point(position.x + 15, position.y - 10),
      new Point(position.x + 30, position.y - 50)
    ),
  ]

  const leftWing = new Path.Ellipse({
    center: new Point(position.x - 20, position.y + 10),
    size: [60, 20],
    fillColor: "lightgray",
    strokeColor: "black",
    opacity: 0.7,
    rotation: -60,
  })

  const rightWing = new Path.Ellipse({
    center: new Point(position.x + 20, position.y + 10),
    size: [60, 20],
    fillColor: "lightgray",
    strokeColor: "black",
    opacity: 0.7,
    rotation: 60,
  })

  const flyGroup = new Group([
    body,
    head,
    leftEye,
    rightEye,
    ...legs,
    leftWing,
    rightWing,
    base,
  ])

  flyGroup.scale(0.4)
  flyGroup.position = position
  flyGroup.rotation = randomMinMax(0, 360)

  flyGroup.on("mouseenter", function () {
    flyGroup.tween(
      {
        rotation: flyGroup.rotation + 100,
        "position.x": randomMinMax(200, view.bounds.width - 200),
        "position.y": randomMinMax(200, view.bounds.height - 200),
      },
      {
        duration: 800,
        easing: "easeOutQuad",
      }
    )
  })
}

function randomMinMax(min, max) {
  return Math.random() * (max - min) + min
}

const flies = []

flies.push(createFly())

setTimeout(function () {
  flies.push(createFly())
}, 5000) // 5000 milliseconds = 5 seconds

setTimeout(function () {
  flies.push(createFly())
}, 10000) // 10000 milliseconds = 10 seconds

// setTimeout(function () {
//   flies.push(createFly())
// }, 15000) // 15000 milliseconds = 15 seconds

// setTimeout(function () {
//   flies.push(createFly())
// }, 20000) // 20000 milliseconds = 20 seconds
