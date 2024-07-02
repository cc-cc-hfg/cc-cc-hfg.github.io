//Yunfei Zhang
// -- Straight path Y
const pathStraightY = new Path({
  strokeColor: "yellow",
  strokeWidth: 10,
})
pathStraightY.add([20, 120])
pathStraightY.add([90, 180])
pathStraightY.add([150, 55])

const numPointsY = 10
for (let i = 0; i < numPointsY; i++) {
  const offset = (pathStraightY.length / (numPointsY - 1)) * i
  const point = pathStraightY.getPointAt(offset)
  const tangent = pathStraightY.getTangentAt(offset)

  const triangle = new Path.RegularPolygon({
    sides: 6,
    radius: 14,
    fillColor: "pink",
    center: point,
  })
  triangle.rotate(tangent.angle)
}

////Y1
const pathStraightY1 = new Path({
  strokeColor: "yellow",
  strokeWidth: 10,
})
pathStraightY1.add([90, 180])
pathStraightY1.add([120, 320])

const numPoints = 7
for (let i = 0; i < numPoints; i++) {
  const offset = (pathStraightY1.length / (numPoints - 1)) * i
  const point = pathStraightY1.getPointAt(offset)
  const tangent = pathStraightY1.getTangentAt(offset)

  const triangle = new Path.RegularPolygon({
    sides: 6,
    radius: 14,
    fillColor: "pink",
    center: point,
  })
  triangle.rotate(tangent.angle)
}

// -- Curved path u
const pathCurvedU = new Path({
  strokeColor: "yellow",
  strokeWidth: 10,
})

pathCurvedU.segments = [
  { point: [120, 200], handleOut: [20, 60] },
  { point: [150, 300], handleIn: [-20, -20], handleOut: [20, 0] },
  { point: [170, 200], handleIn: [20, -20], handleOut: [20, 100] },
  { point: [200, 300] },
]
const numPointsU = 15
for (let i = 0; i < numPointsU; i++) {
  const offset = (pathCurvedU.length / (numPointsU - 1)) * i
  const point = pathCurvedU.getPointAt(offset)
  const tangent = pathCurvedU.getTangentAt(offset)

  const triangle = new Path.RegularPolygon({
    sides: 6,
    radius: 12,
    fillColor: "pink",
    center: point,
  })
  triangle.rotate(tangent.angle)
}

// -- Curved path n
const pathCurvedN = new Path({
  strokeColor: "yellow",
  strokeWidth: 10,
})
pathCurvedN.segments = [
  { point: [200, 200], handleOut: [20, 60] },
  { point: [230, 300], handleIn: [-10, -20], handleOut: [-10, -20] },
  { point: [210, 220], handleIn: [0, 0], handleOut: [0, -30] },
  { point: [240, 210], handleIn: [0, -20], handleOut: [-5, 90] },
  { point: [280, 300] },
]
const numPointsN = 15
for (let i = 0; i < numPointsN; i++) {
  const offset = (pathCurvedN.length / (numPointsN - 1)) * i
  const point = pathCurvedN.getPointAt(offset)
  const tangent = pathCurvedN.getTangentAt(offset)

  const triangle = new Path.RegularPolygon({
    sides: 6,
    radius: 12,
    fillColor: "pink",
    center: point,
  })
  triangle.rotate(tangent.angle)
}
// -- Curved path f
const pathCurvedF = new Path({
  strokeColor: "yellow",
  strokeWidth: 10,
})
pathCurvedF.segments = [
  { point: [300, 90], handleOut: [0, 0] },
  { point: [260, 60], handleIn: [20, -20], handleOut: [-10, 20] },
  { point: [260, 170], handleIn: [0, 0], handleOut: [0, 0] },
  { point: [270, 220], handleIn: [0, 0], handleOut: [15, 50] },
  { point: [320, 300] },
]

const numPointsF = 15
for (let i = 0; i < numPointsF; i++) {
  const offset = (pathCurvedF.length / (numPointsF - 1)) * i
  const point = pathCurvedF.getPointAt(offset)
  const tangent = pathCurvedF.getTangentAt(offset)

  const triangle = new Path.RegularPolygon({
    sides: 6,
    radius: 12,
    fillColor: "pink",
    center: point,
  })
  triangle.rotate(tangent.angle)
}

// -- Straight path F
const pathStraightF = new Path({
  strokeColor: "yellow",
  strokeWidth: 10,
})
pathStraightF.add([240, 170])
pathStraightF.add([290, 165])

const numPointsFf = 3
for (let i = 0; i < numPointsFf; i++) {
  const offset = (pathStraightF.length / (numPointsFf - 1)) * i
  const point = pathStraightF.getPointAt(offset)
  const tangent = pathStraightF.getTangentAt(offset)

  const triangle = new Path.RegularPolygon({
    sides: 6,
    radius: 12,
    fillColor: "pink",
    center: point,
  })
  triangle.rotate(tangent.angle)
}

// -- Curved path E
const pathCurvedE = new Path({
  strokeColor: "yellow",
  strokeWidth: 10,
})
pathCurvedE.segments = [
  { point: [350, 220], handleOut: [20, -5] },
  { point: [335, 190], handleIn: [20, 0], handleOut: [-30, -10] },
  { point: [300, 235] },
]
pathCurvedE.closed = true

const numPointsE = 7
for (let i = 0; i < numPointsE; i++) {
  const offset = (pathCurvedE.length / (numPointsE - 1)) * i
  const point = pathCurvedE.getPointAt(offset)
  const tangent = pathCurvedE.getTangentAt(offset)

  const triangle = new Path.RegularPolygon({
    sides: 6,
    radius: 12,
    fillColor: "pink",
    center: point,
  })
  triangle.rotate(tangent.angle)
}

// -- Curved path E 下半部分
const pathCurvedEE = new Path({
  strokeColor: "yellow",
  strokeWidth: 10,
})
pathCurvedEE.segments = [
  { point: [380, 260], handleOut: [0, 10] },
  { point: [340, 290], handleIn: [20, 0], handleOut: [-30, -10] },
  { point: [300, 235] },
]

const numPointsEe = 6
for (let i = 0; i < numPointsEe; i++) {
  const offset = (pathCurvedEE.length / (numPointsEe - 1)) * i
  const point = pathCurvedEE.getPointAt(offset)
  const tangent = pathCurvedEE.getTangentAt(offset)

  const triangle = new Path.RegularPolygon({
    sides: 6,
    radius: 12,
    fillColor: "pink",
    center: point,
  })
  triangle.rotate(tangent.angle)
}

// -- Straight path I
const star = new Path.Star({
  points: 9,
  center: [370, 140],
  radius1: 25,
  radius2: 90,
  fillColor: "blue",
})

const pathStraightI = new Path({
  strokeColor: "yellow",
  strokeWidth: 10,
})
pathStraightI.add([380, 200])
pathStraightI.add([400, 290])

const numPointsI = 5
for (let i = 0; i < numPointsI; i++) {
  const offset = (pathStraightI.length / (numPointsI - 1)) * i
  const point = pathStraightI.getPointAt(offset)
  const tangent = pathStraightI.getTangentAt(offset)

  const triangle = new Path.RegularPolygon({
    sides: 6,
    radius: 12,
    fillColor: "pink",
    center: point,
  })
  triangle.rotate(tangent.angle)
}

///////group
const group = new Group([
  pathStraightY,
  pathStraightY1,
  pathCurvedU,
  pathCurvedN,
  pathCurvedF,
  pathStraightF,
  pathCurvedE,
  pathCurvedEE,
  star,
  pathStraightI,
])
///smooth
const smoothPath = group.clone()
smoothPath.strokeColor = "rgb(22,249,128)"
smoothPath.smooth({ type: "continuous" })

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
  if (importedSVG) {
    importedSVG.fillColor = params.color
  }
})
