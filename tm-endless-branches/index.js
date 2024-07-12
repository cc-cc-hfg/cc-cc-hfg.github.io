//Endless Branches

function makeTransition(circle, strut, distance, flip) {
  const radius = circle.bounds.height / 2

  const offsetCircle = new Path.Circle({
    radius: radius + 60,
    strokeColor: "red",
    center: circle.position,
    insert: false,
  })

  const quadrantVector1 = new Point()
  quadrantVector1.angle = distance.angle - 90
  quadrantVector1.length = radius
  const quadrantPoint1 = circle.position + quadrantVector1

  const quadrantVector2 = new Point()
  quadrantVector2.angle = distance.angle + 90
  quadrantVector2.length = radius
  const quadrantPoint2 = circle.position + quadrantVector2

  // Sort intersections by its distance to the first quadrant point.
  const intersections = offsetCircle.getIntersections(strut)
  intersections.sort((a, b) => {
    const distanceA = a.point - quadrantPoint1
    const distanceB = b.point - quadrantPoint1
    return distanceA.length - distanceB.length
  })

  const direction = flip ? -1 : 1

  const normalizedDistance = distance.normalize()

  const transition = new Path({
    fillColor: "black",
    closed: true,
    segments: [
      {
        point: quadrantPoint1,
        handleOut: normalizedDistance * direction * radius * 0.9,
      },
      {
        point: intersections[0].point,
        handleIn: normalizedDistance * direction * radius * -0.8,
      },
      {
        point: intersections[1].point,
        handleOut: normalizedDistance * direction * radius * -0.8,
      },
      {
        point: quadrantPoint2,
        handleIn: normalizedDistance * direction * radius * 0.9,
      },
    ],
  })

  // transition.segments.forEach((s) => s.selected = true)

  return transition
}

function makeConnection(circle1, circle2) {
  const distance = circle2.position - circle1.position

  const strut = new Path.Rectangle({
    width: distance.length,
    height: 30,
  })

  strut.position = circle1.position + distance / 2
  strut.rotate(distance.angle)

  const transition1 = makeTransition(circle1, strut, distance, false)
  const transition2 = makeTransition(circle2, strut, distance, true)

  let united = strut.unite(transition1)
  united = united.unite(transition2)
  united = united.unite(circle1)
  united = united.unite(circle2)
  united.blendMode = "source-over"

  united.fillColor = Color.random()
  united.strokeColor = "white"
  united.strokeWidth = 6
  //united.strokeJoin = 'round'
  //united.dashArray = [8, 15]

  //united.selected = true

  transition1.remove()
  transition2.remove()
  strut.remove()
  circle1.remove()
  circle2.remove()
}

let prevCircle

function onMouseDown(event) {
  const newCircle = new Path.Circle({
    fillColor: Color.random(),
    strokeColor: "white",
    strokeWidth: 6,
    radius: 50,
    center: event.point,
  })

  if (prevCircle) {
    makeConnection(prevCircle, newCircle)
  }

  prevCircle = newCircle
}
