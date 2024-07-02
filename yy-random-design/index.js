// Export
const pane = new Pane()
pane
  .addButton({
    title: "Export",
  })
  .on("click", function () {
    const svg = project.exportSVG({ asString: true })
    downloadSVGFile("recolored", svg)
  })

function randomMinMax(min, max) {
  return Math.random() * (max - min) + min
}
const centerX = view.size.width * randomMinMax(0.1, 0.9)
const centerY = view.size.height * randomMinMax(0.1, 0.9)

const randomSizeX = randomMinMax(200, 500)
const randomSizeY = randomMinMax(200, 500)

const EffectCenterX = view.size.width * randomMinMax(0.1, 0.9)
const EffectCenterY = view.size.height * randomMinMax(0.1, 0.9)

let randomMinX = EffectCenterX - randomSizeX
let randomMaxX = EffectCenterX + randomSizeX

let randomMinY = EffectCenterY - randomSizeY
let randomMaxY = EffectCenterY + randomSizeY

const ParticleColor = new Color({
  hue: Math.random() * 360,
  saturation: 0,
  brightness: 1,
})

const secondCircleGradientColor = new Color({
  hue: Math.random() * 360,
  saturation: 0.8,
  brightness: 1,
})

const backgroundColor = "white"
backgroundColor.saturation = 0.11

const BackgroundColorGradient = {
  gradient: {
    stops: [
      ["black", 0],
      ["white", 1],
    ],
    radial: false,
  },
  origin: new Point([0, view.size.height / 2]), // 그라데이션의 시작점
  destination: new Point(view.size.width, view.size.height / 2), // 그라데이션의 끝점
}

const BackgroundOneColor = new Color({
  hue: Math.random() * 360,
  saturation: 0.8,
  brightness: 1,
})

const BackgroundOneColor2 = new Color({
  hue: Math.random() * 360,
  saturation: 0.8,
  brightness: 1,
})

const BackgroundOneColor3 = new Color({
  hue: Math.random() * 360,
  saturation: 0.8,
  brightness: 1,
})

const BackgroundOneColor4 = new Color({
  hue: Math.random() * 360,
  saturation: 0.8,
  brightness: 1,
})

const ArrayBackgroundColorGradient = [
  BackgroundColorGradient,
  backgroundColor,
  BackgroundOneColor,
]

const randomBackgroundColorGradient =
  ArrayBackgroundColorGradient[
    Math.floor(Math.random() * ArrayBackgroundColorGradient.length)
  ]

// 배경 생성
const background = new Path.Rectangle({
  point: [0, 0],
  size: [view.size.width * 3, view.size.height * 3],
  fillColor: new Color({
    hue: Math.random() * 360,
    saturation: 0.5,
    brightness: 1,
  }), // 랜덤 컬러 설정
  insert: true, // 캔버스에 추가
})
// 첫 번째 원 생성
const radius = 1000 // 원의 초기 반지름
const startPoint = new Point(
  view.size.width * randomMinMax(0.1, 0.9),
  view.size.height * randomMinMax(0.1, 0.9)
) // 원의 초기 위치

// 두 번째 원 생성

const startPoint_2 = new Point(
  view.size.width * randomMinMax(0.1, 0.9),
  view.size.height * randomMinMax(0.1, 0.9)
)

// 그라데이션 범위 설정
const gradientRadius = radius * 0.3 // 그라데이션의 반경 (원의 반지름의 일부분으로 설정)
const gradientEndPoint = startPoint.subtract(
  new Point(gradientRadius, gradientRadius)
)

const gradientColor = new Color({
  hue: Math.random() * 360,
  saturation: 1,
  brightness: 1,
})

const circle = new Path.Circle({
  center: startPoint,
  radius: radius,
  fillColor: {
    gradient: {
      stops: [gradientColor, "rgba(255, 255, 255, 0)"],
      radial: true,
    },
    origin: startPoint,
    destination: gradientEndPoint,
  },
  selected: false,
})

// 그라데이션 범위 설정
const secondGradientRadius = radius * 0.3 // 그라데이션의 반경 (원의 반지름의 일부분으로 설정)
const secondGradientEndPoint = startPoint_2.subtract(
  new Point(secondGradientRadius, secondGradientRadius)
)

const secondCircle = new Path.Circle({
  center: startPoint_2,
  radius: radius,
  fillColor: {
    gradient: {
      stops: [secondCircleGradientColor, "rgba(255, 255, 255, 0)"],
      radial: true,
    },
    origin: startPoint_2,
    destination: secondGradientEndPoint,
  },
  selected: false,
})

////<<<사각형모양배경생성
function BackgroundRectangle() {
  // 다섯 개의 원을 원형으로 정렬하여 생성

  const width = view.size.width * randomMinMax(0.5, 0.8) // 반지름을 100에서 ±25% 범위로 랜덤 설정
  const height = view.size.height * randomMinMax(0.5, 0.8) // 반지름을 100에서 ±25% 범위로 랜덤 설

  const Rectangle = new Path.Rectangle({
    center: new Point(centerX, centerY),
    width: width,
    height: height,
    fillColor: "rgba(1,1,1,0.00001)",
    draggable: true,
  })

  // 드래그 앤 드롭 기능 구현
  let dragging = false
  let offset = new paper.Point(0, 0)
  let outsidePath

  // 외곽선 설정 함수
  function updateOutsidePath() {
    if (outsidePath) {
      outsidePath.remove() // 기존의 outsidePath 제거
    }
    outsidePath = Rectangle.exclude(background)
    outsidePath.fillColor = randomBackgroundColorGradient
  }

  Rectangle.onMouseDown = function (event) {
    dragging = true
    offset = event.point.subtract(this.position)
  }

  Rectangle.onMouseDrag = function (event) {
    if (dragging) {
      this.position = event.point.subtract(offset)
      updateOutsidePath() // 드래그 중에 위치 업데이트
    }
  }

  Rectangle.onMouseUp = function (event) {
    dragging = false

    updateOutsidePath() // 드래그 종료 후 위치 업데이트
  }

  // Canvas 클릭 시 드래그 종료
  paper.view.onClick = function (event) {
    dragging = false
  }

  updateOutsidePath() // 초기 외곽선 설정

  return Rectangle
}

function ShowBackgroundRectangle(x) {
  if (Math.random() < x) {
    BackgroundRectangle()
  }
}

function BackgroundVerticalEllipse() {
  const ellipse = new Path.Ellipse({
    center: new Point(centerX, centerY),
    size: [
      view.size.width * randomMinMax(1.1, 1.5),
      view.size.height * randomMinMax(0.7, 1.1),
    ],
    fillColor: "rgba(1,1,1,0.00001)",
    draggable: true,
  })

  // 드래그 앤 드롭 기능 구현
  let dragging = false
  let offset = new paper.Point(0, 0)
  let outsidePath

  // 외곽선 설정 함수
  function updateOutsidePath2() {
    if (outsidePath) {
      outsidePath.remove() // 기존의 outsidePath 제거
    }
    outsidePath = ellipse.exclude(background)
    outsidePath.fillColor = randomBackgroundColorGradient
  }

  ellipse.onMouseDown = function (event) {
    dragging = true
    offset = event.point.subtract(this.position)
  }

  ellipse.onMouseDrag = function (event) {
    if (dragging) {
      this.position = event.point.subtract(offset)
      updateOutsidePath2() // 드래그 중에 위치 업데이트
    }
  }

  ellipse.onMouseUp = function (event) {
    dragging = false

    updateOutsidePath2() // 드래그 종료 후 위치 업데이트
  }

  // Canvas 클릭 시 드래그 종료
  paper.view.onClick = function (event) {
    dragging = false
  }

  updateOutsidePath2() // 초기 외곽선 설정

  return ellipse
}

function ShowBackgroundVerticalEllipse(x) {
  if (Math.random() < x) {
    BackgroundVerticalEllipse()
  }
}

let trianglesGroup = [] // 여러 lightGroup을 저장하기 위한 배열
const TrianglesColors = ["rgba(1,1,1,0.000001)", BackgroundOneColor3]
// 무작위로 색상 선택
const TrianglesRandomColor =
  TrianglesColors[Math.floor(Math.random() * TrianglesColors.length)]

function createComplexLight() {
  const center = new paper.Point(200, 200) // 중심점 설정

  const triangles = []

  for (let i = 0; i < 10; i++) {
    // 각 삼각형의 크기를 랜덤하게 변형
    const size = randomMinMax(60, 100) // 한 변의 길이 랜덤 설정

    // 삼각형을 구성하는 세 꼭지점의 위치 계산
    const point1 = center.add([0, -size / Math.sqrt(3)]) // 윗 꼭지점
    const point2 = center.add([-size / 30, size / (2 * Math.sqrt(3))]) // 왼쪽 꼭지점
    const point3 = center.add([size / 30, size / (2 * Math.sqrt(3))]) // 오른쪽 꼭지점

    // 삼각형 그리기
    const triangle = new paper.Path()
    triangle.add(point1)
    triangle.add(point2)
    triangle.add(point3)
    triangle.closed = true

    const rotatedTriangle = triangle.clone()
    rotatedTriangle.rotate(36 * i, rotatedTriangle.bounds.bottomCenter) // 밑변을 중심으로 회전
    triangles.push(rotatedTriangle) // 삼각형을 배열에 추가
  }

  // 모든 삼각형을 결합하여 하나의 경로로 만듦
  let unitedTriangles = triangles[0]
  const TriangleIntermediatePath = []

  for (let i = 1; i < triangles.length; i++) {
    unitedTriangles = unitedTriangles.unite(triangles[i])
    TriangleIntermediatePath.push(unitedTriangles) // 중간 경로를 배열에 저장
  }

  // 배열에 있는 삼각형들을 제거
  for (let i = 0; i < triangles.length; i++) {
    triangles[i].remove()
  }

  // 중간 경로들을 제거
  for (let i = 0; i < TriangleIntermediatePath.length - 1; i++) {
    TriangleIntermediatePath[i].remove()
  }

  // 랜덤한 포인트 설정
  unitedTriangles.position = new paper.Point(
    randomMinMax(view.size.width * 0.1, view.size.width * 0.9),
    randomMinMax(view.size.height * 0.1, view.size.height * 0.9)
  )

  unitedTriangles.strokeColor = BackgroundOneColor3
  unitedTriangles.fillColor = TrianglesRandomColor
  unitedTriangles.strokeWidth = 2
  unitedTriangles.scaling = randomMinMax(0.5, 2.5)

  // 드래그 앤 드롭 기능 추가
  let dragging = false
  let offset = new paper.Point(0, 0)

  unitedTriangles.onMouseDown = function (event) {
    dragging = true
    offset = event.point.subtract(this.position)
  }

  unitedTriangles.onMouseDrag = function (event) {
    if (dragging) {
      this.position = event.point.subtract(offset)
    }
  }

  unitedTriangles.onMouseUp = function (event) {
    dragging = false
  }

  // Canvas 클릭 시 드래그 종료
  paper.view.onClick = function (event) {
    dragging = false
  }

  // trianglesGroup에 추가
  trianglesGroup.push(unitedTriangles)
}

function createUnitedComplexLight(index) {
  if (index >= 6) return

  createComplexLight()
  setTimeout(() => createUnitedComplexLight(index + 1), 200)
}

function ShowComplexLightLine(x) {
  if (Math.random() < x) {
    createUnitedComplexLight(0)
  }
}
const EllipsesColors = ["rgba(1,1,1,0.00001)", BackgroundOneColor4]
// 무작위로 색상 선택
const EllipsesRandomColor =
  EllipsesColors[Math.floor(Math.random() * EllipsesColors.length)]

const EllipseSizeX = randomMinMax(30, 100)
const EllipseSizeY = randomMinMax(30, 100)

function createEllipses() {
  const numEllipses = 5 // 생성할 타원의 개수
  const interval = 100 // 타원 간의 간격
  const delay = 500 // 타원 생성 간의 딜레이(ms)

  // 처음 타원의 중심점 설정
  let startPoint = new Point(centerX, centerY)

  // 타원 그룹 생성
  const ellipseGroup = new Group()

  // 타원을 생성하는 함수
  function createEllipseAt(point) {
    const ellipse = new Path.Ellipse({
      center: point,
      size: [EllipseSizeX, EllipseSizeY], // 타원의 크기 (가로, 세로)
      fillColor: EllipsesRandomColor,
      strokeColor: BackgroundOneColor4,
      strokeWidth: 2,
    })
    ellipseGroup.addChild(ellipse)
  }

  // 재귀적으로 타원을 생성하는 함수
  function createEllipsesRecursively(index) {
    if (index < numEllipses) {
      // 새로운 타원의 중심점 계산
      const point = startPoint.add(new Point(interval * index, 0))
      createEllipseAt(point)

      // 다음 타원을 생성하기 위한 setTimeout 호출
      setTimeout(function () {
        createEllipsesRecursively(index + 1)
      }, delay)
    } else {
      addDragAndDrop()
    }
  }
  function addDragAndDrop() {
    // 드래그 앤 드롭 기능 추가
    let dragging = false
    let offset = new paper.Point(0, 0)

    ellipseGroup.onMouseDown = function (event) {
      dragging = true
      offset = event.point.subtract(ellipseGroup.position)
    }

    ellipseGroup.onMouseDrag = function (event) {
      if (dragging) {
        ellipseGroup.position = event.point.subtract(offset)
      }
    }

    ellipseGroup.onMouseUp = function (event) {
      dragging = false
    }

    // Canvas 클릭 시 드래그 종료
    paper.view.onClick = function (event) {}
  }
  // 애니메이션 시작
  createEllipsesRecursively(0)
}

function ShowEllipses(x) {
  if (Math.random() < x) {
    createEllipses()
  }
}
// 랜덤 포인트 생성 함수
function randomPoint() {
  return new Point(
    randomMinMax(view.size.width * 0.1, view.size.width * 0.9),
    randomMinMax(view.size.height * 0.1, view.size.height * 0.9)
  )
}

// 랜덤 포인트에서 오차범위 내에서 랜덤한 방향으로 뻗어나가는 선을 그리는 함수
function drawLinesFromRandomPoint() {
  const startPoint = randomPoint() // 랜덤한 출발점 생성
  const lines = [] // 생성된 라인들을 저장할 배열

  // 라인 정보를 저장하는 객체 생성
  for (let i = 0; i < 20; i++) {
    const angle = randomMinMax(0, 2 * Math.PI) // 랜덤한 각도
    const lineLength = randomMinMax(300, 700) // 선의 길이

    // 시작점에서 뻗어나가는 끝점 계산
    const endPoint = startPoint.add(
      new Point({
        length: lineLength,
        angle: angle * (180 / Math.PI),
      })
    )

    // 선 생성
    const line = new Path.Line({
      from: startPoint,
      to: endPoint,
      strokeColor: BackgroundOneColor2, // 선의 색상
      strokeWidth: 10, // 선의 너비 (히트박스를 크게 하기 위해 넓게 설정)
    })

    lines.push(line)
    startPoint.x += randomMinMax(-10, 10) // 시작점의 x 좌표에 무작위 오차 적용
    startPoint.y += randomMinMax(-10, 10) // 시작점의 y 좌표에 무작위 오차 적용
  }
  let dragging = false
  // 그룹 생성
  const group = new Group(lines)

  // 그룹에 마우스 이벤트 리스너 추가
  group.onMouseDown = function (event) {
    dragging = true
    this.startDragPoint = event.point.clone() // 드래그 시작 지점 저장
  }

  group.onMouseDrag = function (event) {
    if (dragging) {
      const delta = event.point.subtract(this.startDragPoint)
      this.position = this.position.add(delta) // 그룹 전체를 드래그 이동 처리
      this.startDragPoint = event.point.clone() // 다음 드래그를 위해 시작 지점 갱신
    }
  }

  group.onMouseUp = function (event) {
    dragging = false
  }

  // 그룹 반환
  return group
}

// 화면에 라인 그리기
function ShowLinesFromRandomPoint(x) {
  if (Math.random() < x) {
    const group = drawLinesFromRandomPoint()
    view.draw() // 화면 업데이트
    return group // 그룹 반환
  }
}

// 그룹의 선들을 이동 가능하게 만든 후, 원하는 때에 그룹을 사용하여 작업할 수 있습니다.

var lastPoint
var circles = []
var initialStates = []
var path
var currentStep = 0
let isShowCirclesAlongPathNotCalled = true
const animationInterval = 30 // 애니메이션 간격 (밀리초)
const CircleBrushColor = new Color({
  hue: Math.random() * 360,
  saturation: 1,
  brightness: 1,
})

// 랜덤한 포인트 4개 생성
function generateRandomPoints() {
  const points = []
  for (let i = 0; i < randomMinMax(3, 10); i++) {
    const x = view.size.width * randomMinMax(0, 1)
    const y = view.size.height * randomMinMax(0, 1)
    points.push(new Point(x, y))
  }
  return points
}

// 포인트들을 연결하여 패스 생성
function createPath(points) {
  path = new Path({
    segments: points,
    closed: true,
  })
  return path
}

// 패스를 일정 간격으로 쪼개어 각 지점마다 원을 생성하는 함수
function createCirclesAlongPath(path) {
  const pathLength = path.length
  const stepSize = pathLength / 200 // 100개의 지점으로 나눕니다.

  function animate() {
    var circleRadius = randomMinMax(70, 120)
    if (currentStep >= pathLength) {
      clearInterval(animationId) // 애니메이션 종료
      enableCircleDragging()
      return
    }

    const point = path.getPointAt(currentStep)

    const gradientEndPoint = point.add(
      new Point(circleRadius * 0.5, circleRadius * 0.5)
    )

    var circle = new Path.Circle({
      center: point,
      radius: circleRadius,
      fillColor: {
        gradient: {
          stops: [CircleBrushColor, "rgba(255, 255, 255, 0)"],
          radial: true,
        },
        origin: point,
        destination: gradientEndPoint - 20,
      },
      selected: false,
    })

    circles.push(circle)
    currentStep += stepSize
  }

  const animationId = setInterval(animate, animationInterval)
}

function enableCircleDragging() {
  let dragging = false
  let offset = new paper.Point(0, 0)

  const group = new Group(circles) // circles 배열을 그룹으로 묶기
  group.onMouseDown = function (event) {
    dragging = true
    offset = event.point.subtract(group.position)
  }

  group.onMouseDrag = function (event) {
    if (dragging) {
      group.position = event.point.subtract(offset)
    }
  }

  group.onMouseUp = function (event) {
    dragging = false
  }

  // Canvas 클릭 시 드래그 종료
  paper.view.onClick = function (event) {
    dragging = false
  }
}

// 초기 설정 및 실행
function ShowCirclesAlongPath(x) {
  if (Math.random() < x) {
    const points = generateRandomPoints()
    createPath(points)
    createCirclesAlongPath(path)
    isShowCirclesAlongPathNotCalled = false
  }
}

// 초기화 함수 호출
ShowCirclesAlongPath(0.3)

var lastPoint
var circles2 = []
var initialStates = []
var path2
var currentSet2 = 0

const animationInterval2 = 30 // 애니메이션 간격 (밀리초)
const CircleBrushColor2 = "white"

// 랜덤한 포인트 4개 생성
function generateRandomPoints2() {
  const points2 = []
  for (let i = 0; i < randomMinMax(3, 5); i++) {
    const x = view.size.width * randomMinMax(0, 1)
    const y = view.size.height * randomMinMax(0, 1)
    points2.push(new Point(x, y))
  }
  return points2
}

// 포인트들을 연결하여 패스 생성
function createPath2(points2) {
  path2 = new Path({
    segments: points2,
    closed: true,
  })
  return path2
}

// 패스를 일정 간격으로 쪼개어 각 지점마다 원을 생성하는 함수
function createCirclesAlongPath2(path2) {
  const pathLength = path2.length
  const stepSize = pathLength / 200 // 100개의 지점으로 나눕니다.

  function animate() {
    var circleRadius = randomMinMax(100, 170)
    if (currentSet2 >= pathLength) {
      clearInterval(animationId) // 애니메이션 종료
      enableCircleDragging2()
      return
    }

    const point = path2.getPointAt(currentSet2)

    const gradientEndPoint = point.add(
      new Point(circleRadius * 0.5, circleRadius * 0.5)
    )

    var circle2 = new Path.Circle({
      center: point,
      radius: circleRadius,
      fillColor: {
        gradient: {
          stops: [CircleBrushColor2, "rgba(255, 255, 255, 0)"],
          radial: true,
        },
        origin: point,
        destination: gradientEndPoint - 20,
      },
      selected: false,
    })

    circles2.push(circle2)
    currentSet2 += stepSize
  }

  const animationId = setInterval(animate, animationInterval2)
}

function enableCircleDragging2() {
  let dragging = false
  let offset = new paper.Point(0, 0)

  const group = new Group(circles2) // circles 배열을 그룹으로 묶기
  group.onMouseDown = function (event) {
    dragging = true
    offset = event.point.subtract(group.position)
  }

  group.onMouseDrag = function (event) {
    if (dragging) {
      group.position = event.point.subtract(offset)
    }
  }

  group.onMouseUp = function (event) {
    dragging = false
  }

  // Canvas 클릭 시 드래그 종료
  paper.view.onClick = function (event) {
    dragging = false
  }
}

var lastPoint
var circles3 = []
var initialStates = []
var path3
var currentSet3 = 0

const animationInterval3 = 30 // 애니메이션 간격 (밀리초)
const CircleBrushColor3 = "white"

// 랜덤한 포인트 4개 생성
function generateRandomPoints3() {
  const points3 = []
  for (let i = 0; i < randomMinMax(4, 8); i++) {
    const x = view.size.width * randomMinMax(0, 1)
    const y = view.size.height * randomMinMax(0, 1)
    points3.push(new Point(x, y))
  }
  return points3
}

// 포인트들을 연결하여 패스 생성
function createPath3(points3) {
  path3 = new Path({
    segments: points3,
    closed: true,
  })
  return path3
}

// 패스를 일정 간격으로 쪼개어 각 지점마다 원을 생성하는 함수
function createCirclesAlongPath3(path3) {
  const pathLength = path3.length
  const stepSize = pathLength / 300 // 100개의 지점으로 나눕니다.

  function animate() {
    var circleRadius = randomMinMax(75, 100)
    if (currentSet3 >= pathLength) {
      clearInterval(animationId) // 애니메이션 종료
      enableCircleDragging3()
      return
    }

    const point = path3.getPointAt(currentSet3)

    const gradientEndPoint = point.add(
      new Point(circleRadius * 0.5, circleRadius * 0.5)
    )

    var circle3 = new Path.Circle({
      center: point,
      radius: circleRadius,
      fillColor: {
        gradient: {
          stops: [CircleBrushColor3, "rgba(255, 255, 255, 0)"],
          radial: true,
        },
        origin: point,
        destination: gradientEndPoint - 30,
      },
      selected: false,
    })

    circles3.push(circle3)
    currentSet3 += stepSize
  }

  const animationId = setInterval(animate, animationInterval3)
}

function enableCircleDragging3() {
  let dragging = false
  let offset = new paper.Point(0, 0)

  const group = new Group(circles3) // circles 배열을 그룹으로 묶기
  group.onMouseDown = function (event) {
    dragging = true
    offset = event.point.subtract(group.position)
  }

  group.onMouseDrag = function (event) {
    if (dragging) {
      group.position = event.point.subtract(offset)
    }
  }

  group.onMouseUp = function (event) {
    dragging = false
  }

  // Canvas 클릭 시 드래그 종료
  paper.view.onClick = function (event) {
    dragging = false
  }
}

let isShowCirclesAlongPath2NotCalled = false
// 초기 설정 및 실행
function ShowCirclesAlongPath2(x) {
  if (isShowCirclesAlongPathNotCalled) {
    if (Math.random() < x) {
      const points = generateRandomPoints2()
      createPath2(points)
      createCirclesAlongPath2(path2)
      isShowCirclesAlongPath2NotCalled = true
    }
  }
}
// 초기화 함수 호출
ShowCirclesAlongPath2(0.5)

// 초기 설정 및 실행
function ShowCirclesAlongPath3(x) {
  if (isShowCirclesAlongPath2NotCalled) {
    if (Math.random() < x) {
      const points = generateRandomPoints3()
      createPath3(points)
      createCirclesAlongPath3(path3)
    }
  } else {
    null
  }
}
// 초기화 함수 호출
ShowCirclesAlongPath3(1)

////랜덤 배경생성
const funcArrayBackground = [BackgroundRectangle, BackgroundVerticalEllipse]

const randomIndexBackground = Math.floor(
  Math.random() * funcArrayBackground.length
)

funcArrayBackground[randomIndexBackground]()

//1_원
const randomX = Math.random() * view.size.width
const randomY = Math.random() * view.size.height

EffectContainer = new Path.Rectangle({
  center: [
    (randomMaxX - randomMinX) / 2 + randomMinX,
    (randomMaxY - randomMinY) / 2 + randomMinY,
  ],
  size: [randomMaxX - randomMinX, randomMaxY - randomMinY],
  fillColor: "rgba(1,1,1,0.000001)",
  strokeWidth: 5,
})

var EffectContainerCenter = EffectContainer.position

var EffectPoint1 = new Point(
  EffectContainer.position.x - EffectContainer.bounds.width / 2,
  EffectContainer.position.y - EffectContainer.bounds.height / 2
)
var EffectPoint2 = new Point(
  EffectContainer.position.x + EffectContainer.bounds.width / 2,
  EffectContainer.position.y - EffectContainer.bounds.height / 2
)
var EffectPoint3 = new Point(
  EffectContainer.position.x + EffectContainer.bounds.width / 2,
  EffectContainer.position.y + EffectContainer.bounds.height / 2
)

function updateEffectContainerBounds() {
  EffectContainerCenter = EffectContainer.position

  EffectPoint1 = new Point(
    EffectContainer.position.x - EffectContainer.bounds.width / 2,
    EffectContainer.position.y - EffectContainer.bounds.height / 2
  )
  EffectPoint2 = new Point(
    EffectContainer.position.x + EffectContainer.bounds.width / 2,
    EffectContainer.position.y - EffectContainer.bounds.height / 2
  )
  EffectPoint3 = new Point(
    EffectContainer.position.x + EffectContainer.bounds.width / 2,
    EffectContainer.position.y + EffectContainer.bounds.height / 2
  )

  // MiniCircle들의 위치 초기화
  MiniCircles.forEach((circle) => {
    circle.position.x = randomMinMax(
      EffectContainer.bounds.left + 20,
      EffectContainer.bounds.right - 20
    )
    circle.position.y = randomMinMax(
      EffectContainer.bounds.top + 20,
      EffectContainer.bounds.bottom - 20
    )
  })
}
let effectContainerDragging = false
let offset = new paper.Point(0, 0)

EffectContainer.onMouseDrag = function (event) {
  if (!effectContainerDragging) {
    effectContainerDragging = true
    offset = event.point.subtract(this.position)
  }
  this.position = event.point.subtract(offset)
  updateEffectContainerBounds()
}

EffectContainer.onMouseUp = function (event) {
  effectContainerDragging = false
}

// Canvas 클릭 시 드래그 종료
paper.view.onClick = function (event) {
  effectContainerDragging = false
}

const MiniCircles = [] // MiniCircle들을 저장할 배열
const numMiniCircles = 30 // 생성할 원의 개수

function MiniCircleAnimated() {
  for (let i = MiniCircles.length; i < numMiniCircles; i++) {
    const baseRadius = 5
    const radius = baseRadius * randomMinMax(0.05, 1.95)

    const MiniCircleColor = backgroundColor
    const MiniCircle = new Path.Circle({
      center: new Point(
        randomMinMax(
          EffectContainer.bounds.left + 20,
          EffectContainer.bounds.right - 20
        ),
        randomMinMax(
          EffectContainer.bounds.top + 20,
          EffectContainer.bounds.bottom - 20
        )
      ),
      radius: radius,
      fillColor: ParticleColor, // 흰색으로 설정
    })

    // 부유하는 효과를 위한 초기 설정
    MiniCircle.data = {
      amplitude: randomMinMax(0.5, 2.5), // 부유의 진폭
      frequency: randomMinMax(0.005, 0.025), // 부유의 주파수
      offset: new Point(randomMinMax(-5, 5), randomMinMax(-5, 5)), // 초기 오프셋 설정
      angle: Math.random() * Math.PI * 2, // 초기 각도 설정
    }

    MiniCircles.push(MiniCircle) // 생성된 MiniCircle을 배열에 추가
  }

  MiniCircles.forEach((circle) => {
    const { amplitude, frequency, offset, angle } = circle.data

    // 부유하는 효과 계산
    const delta = new Point(
      Math.sin(angle * frequency) * amplitude,
      Math.cos(angle * frequency) * amplitude
    )

    circle.position = circle.position.add(delta)
    circle.position = circle.position.add(offset)

    // 각 원의 위치가 화면을 벗어나면 반대편으로 이동
    if (circle.position.x > EffectPoint2.x - 10) {
      circle.position.x = EffectPoint1.x + 10
    } else if (circle.position.x < EffectPoint1.x + 10) {
      circle.position.x = EffectPoint2.x - 10
    }
    if (circle.position.y > EffectPoint3.y - 10) {
      circle.position.y = EffectPoint1.y + 10
    } else if (circle.position.y < EffectPoint1.y + 10) {
      circle.position.y = EffectPoint3.y - 10
    }

    // 각도 업데이트
    circle.data.angle += 0.03 // 각속도
    circle.strokeColor = "black"
  })
}

//2_빛
let lightGroups = [] // 여러 lightGroup을 저장하기 위한 배열
let createLightInterval = null // 타이머를 위한 변수

function createLight() {
  const center = new paper.Point(200, 200) // 중심점 설정
  const size = 100 // 한 변의 길이

  // 삼각형을 구성하는 세 꼭지점의 위치 계산
  const point1 = center.add([0, -size / Math.sqrt(3)]) // 윗 꼭지점
  const point2 = center.add([-size / 30, size / (2 * Math.sqrt(3))]) // 왼쪽 꼭지점
  const point3 = center.add([size / 30, size / (2 * Math.sqrt(3))]) // 오른쪽 꼭지점

  // 삼각형 그리기
  const triangle = new paper.Path()
  triangle.add(point1)
  triangle.add(point2)
  triangle.add(point3)
  triangle.closed = true
  triangle.fillColor = "black" // 삼각형의 색상을 검정으로 설정

  const triangles = []

  for (let i = 0; i < 4; i++) {
    const rotatedTriangle = triangle.clone()
    rotatedTriangle.rotate(90 * i, rotatedTriangle.bounds.bottomCenter) // 밑변을 중심으로 회전
    triangles.push(rotatedTriangle) // 삼각형을 배열에 추가
  }

  // 모든 삼각형을 결합하여 하나의 경로로 만듦
  let unitedTriangles = triangles[0]
  const TriangleIntermediatePath = []

  for (let i = 1; i < triangles.length; i++) {
    unitedTriangles = unitedTriangles.unite(triangles[i])
    TriangleIntermediatePath.push(unitedTriangles) // 중간 경로를 배열에 저장
  }

  // 배열에 있는 삼각형들을 제거
  for (let i = 0; i < triangles.length; i++) {
    triangles[i].remove()
  }

  // 중간 경로들을 제거
  for (let i = 0; i < TriangleIntermediatePath.length - 1; i++) {
    TriangleIntermediatePath[i].remove()
  }

  // 하얀색 원을 생성하여 그라디언트 색 적용
  const LightCircleCenter = unitedTriangles.bounds.center
  const LightCircleGradientRadius = 40 // 그라디언트 반지름 설정
  const gradient = {
    gradient: {
      stops: ["white", "rgba(255, 255, 255, 0)"],
      radial: true,
    },
    origin: LightCircleCenter,
    destination: LightCircleCenter.add([LightCircleGradientRadius, 0]),
  }
  const whiteCircle = new paper.Path.Circle(
    LightCircleCenter,
    LightCircleGradientRadius
  )
  whiteCircle.fillColor = gradient

  // 최종 결합된 삼각형에 그라디언트 색 적용
  unitedTriangles.fillColor = "white"
  triangle.remove()

  // unitedTriangles와 whiteCircle을 그룹으로 묶기
  const lightGroup = new paper.Group([unitedTriangles, whiteCircle])

  // 시작 스케일을 0으로 설정
  lightGroup.scaling = new paper.Point(0.1, 0.1) // 초기 스케일을 0.1로 설정

  // 랜덤한 포인트 설정

  lightGroup.position = new paper.Point(
    randomMinMax(EffectPoint1.x + 20, EffectPoint2.x - 20),
    randomMinMax(EffectPoint1.y + 20, EffectPoint3.y - 20)
  )

  // 초기 스케일과 애니메이션 관련 변수 설정
  lightGroup.initialScale = new paper.Point(1.1, 1.1) // 초기 스케일 설정
  lightGroup.LightScaleFactor = randomMinMax(0.1, 0.7) // 시작 스케일 팩터 설정
  lightGroup.scalingDirection = 1 // 1: 확대, -1: 축소
  lightGroup.maxLightScaleFactor = 1.5 // 최대 확대 배율
  lightGroup.scaleSpeed = 0.2 // 애니메이션 속도

  lightGroups.push(lightGroup) // 배열에 추가
}

function LightAnimated() {
  lightGroups.forEach((lightGroup, index) => {
    const initialScale = lightGroup.initialScale.clone()
    let LightScaleFactor = lightGroup.LightScaleFactor
    let scalingDirection = lightGroup.scalingDirection
    const maxLightScaleFactor = lightGroup.maxLightScaleFactor // 최대 확대 배율
    const scaleSpeed = lightGroup.scaleSpeed // 애니메이션 속도

    // LightScaleFactor 조정
    LightScaleFactor += scaleSpeed * scalingDirection

    // LightScaleFactor 범위 제한
    if (LightScaleFactor >= maxLightScaleFactor) {
      LightScaleFactor = maxLightScaleFactor
      scalingDirection = -1 // 축소 방향으로 전환
    } else if (LightScaleFactor <= 0.1) {
      // 스케일이 충분히 작아지면 lightGroup 제거
      lightGroup.remove()
      lightGroups.splice(index, 1) // 배열에서 제거
      return // 함수 종료
    }

    // 스케일 적용
    lightGroup.scaling = initialScale.multiply(LightScaleFactor)

    // 다음 프레임에 다시 호출
    lightGroup.LightScaleFactor = LightScaleFactor
    lightGroup.scalingDirection = scalingDirection
  })
  if (!createLightInterval) {
    createLightInterval = setInterval(createLight, 50) // 일정 간격으로 새로운 lightGroup 생성
  }
}

const funcArrayRandomEffect = [MiniCircleAnimated, LightAnimated]

const randomIndexEffect = Math.floor(
  Math.random() * funcArrayRandomEffect.length
)

function onFrame(event) {
  // 두 번째 원 애니메이션 및 색상 업데이트
  const scaleFactor2 = Math.max(Math.sin(event.time) * 0.03 + 1.0, 0.5)
  const wiggleAmount2 = Math.sin(event.time) * 10
  secondCircle.scale(scaleFactor2)
  secondCircle.position.x += randomMinMax(-wiggleAmount2, wiggleAmount2)
  secondCircle.position.y += randomMinMax(-wiggleAmount2, wiggleAmount2)
  const secondCircleGradientColor = new Color({
    hue: Math.random() * 360,
    saturation: 1,
    brightness: 1,
  })

  // 첫 번째 원 애니메이션 및 색상 업데이트
  const scaleFactor = Math.max(Math.sin(event.time) * 0.03 + 1.0, 0.5)
  const wiggleAmount = Math.sin(event.time) * 10
  circle.scale(scaleFactor)
  circle.position.x += randomMinMax(-wiggleAmount, wiggleAmount)
  circle.position.y += randomMinMax(-wiggleAmount, wiggleAmount)

  // FlowerAnimated 호출 여부에 따라 애니메이션 적용

  funcArrayRandomEffect[randomIndexEffect]()
}

// onFrame 이벤트 핸들러 추가
view.on("frame", onFrame)

ShowEllipses(0.3)
ShowComplexLightLine(0.3)

// 선 그리기 함수 호출
ShowLinesFromRandomPoint(0.3)
//ShowRandomFlowerLine(0.3)

// 화면의 4면 중 한쪽에 랜덤으로 붙어서 랜덤 두께를 가지는 선을 그리는 함수
function drawRandomOutline() {
  const viewWidth = view.size.width
  const viewHeight = view.size.height

  // 랜덤으로 한 면을 선택 (0: top, 1: right, 2: bottom, 3: left)
  const side = Math.floor(Math.random() * 4)

  // 선의 두께를 랜덤으로 설정
  const lineWidth = randomMinMax(100, 300)

  // 시작점과 끝점 설정
  let from, to

  switch (side) {
    case 0: // top
      from = new Point(0, 0)
      to = new Point(viewWidth, 0)
      break
    case 1: // right
      from = new Point(viewWidth, 0)
      to = new Point(viewWidth, viewHeight)
      break
    case 2: // bottom
      from = new Point(0, viewHeight)
      to = new Point(viewWidth, viewHeight)
      break
    case 3: // left
      from = new Point(0, 0)
      to = new Point(0, viewHeight)
      break
  }

  const LineColors = [
    "blue",
    "red",
    "black",
    "white",
    "green",
    "yellow",
    "purple",
  ]
  // 무작위로 색상 선택
  const randomLineColor =
    LineColors[Math.floor(Math.random() * LineColors.length)]

  // 선 생성
  const line = new Path.Line({
    from: from,
    to: to,
    strokeColor: randomLineColor,
    strokeWidth: lineWidth,
  })

  return line
}
function ShowRandomOutLine(x) {
  if (Math.random() < x) {
    drawRandomOutline()
  }
}
// 선을 그리는 함수 호출

const colors = ["blue", "red", "black"]
// 무작위로 색상 선택
const randomColor = colors[Math.floor(Math.random() * colors.length)]

////랜덤 라인생성

// 화면의 50%에서 80%를 가리는 박스를 생성하는 함수
function drawRandomBox() {
  const viewWidth = view.size.width
  const viewHeight = view.size.height

  const BackgroundColorGradient = {
    gradient: {
      stops: [
        [
          new Color({
            hue: Math.random() * 360,
            saturation: 0.8,
            brightness: 1,
          }),
          0,
        ],
        ["white", 1],
      ],
      radial: false,
    },
    origin: new Point(0, view.size.height / 2), // 그라데이션의 시작점
    destination: new Point(view.size.width, view.size.height / 2), // 그라데이션의 끝점
  }

  const BackgroundOneColor = new Color({
    hue: Math.random() * 360,
    saturation: 0.9,
    brightness: 1,
  })

  const colors = ["white", BackgroundColorGradient, BackgroundOneColor]

  // 무작위로 색상 선택
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  // 박스의 너비를 화면 너비의 50%에서 80% 사이의 랜덤 값으로 설정
  const boxWidth = randomMinMax(viewWidth * 0.5, viewWidth * 0.8)

  // 박스의 높이를 화면 높이와 동일하게 설정
  const boxHeight = viewHeight

  // 박스의 X 좌표를 화면의 왼쪽이나 오른쪽에 딱 붙게 설정
  const boxX = Math.random() < 0.5 ? 0 : viewWidth - boxWidth

  // 박스의 Y 좌표를 0으로 설정하여 화면의 상단에 맞춤
  const boxY = 0

  // 박스 생성
  const box = new Path.Rectangle({
    point: [boxX, boxY],
    size: [boxWidth, boxHeight],
    fillColor: randomColor,
  })

  return box
}
function ShowRandomBox(x) {
  if (Math.random() < x) {
    drawRandomBox()
  }
}
ShowRandomOutLine(0.3)
// 박스를 그리는 함수 호출
ShowRandomBox(0.3)

var codeLines = [
  "function randomMinMax(min, max) {",
  "  return Math.random() * (max - min) + min;",
  "}",
  "const centerX = view.size.width * randomMinMax(0.1, 0.9);",
  "const centerY = view.size.height * randomMinMax(0.1, 0.9);",
  "const randomSizeX = randomMinMax(200, 500);",
  "const randomSizeY = randomMinMax(200, 500);",
  "const EffectCenterX = view.size.width * randomMinMax(0.1, 0.9);",
  "const EffectCenterY = view.size.height * randomMinMax(0.1, 0.9);",
  "let randomMinX = EffectCenterX - randomSizeX;",
  "let randomMaxX = EffectCenterX + randomSizeX;",
  "let randomMinY = EffectCenterY - randomSizeY;",
  "let randomMaxY = EffectCenterY + randomSizeY;",
  "const ParticleColor = new Color({",
  "  hue: Math.random() * 360,",
  "  saturation: 0,",
  "  brightness: 1,",
  "});",
  "const secondCircleGradientColor = new Color({",
  "  hue: Math.random() * 360,",
  "  saturation: 0.8,",
  "  brightness: 1,",
  "});",
  "const backgroundColor = 'white';",
  "backgroundColor.saturation = 0.11;",
  "const BackgroundColorGradient = {",
  "  gradient: {",
  "    stops: [",
  "      ['black', 0],",
  "      ['white', 1],",
  "    ],",
  "    radial: false,",
  "  },",
  "  origin: new Point([0, view.size.height / 2]),",
  "  destination: new Point(view.size.width, view.size.height / 2),",
  "};",
  "const BackgroundOneColor = new Color({",
  "  hue: Math.random() * 360,",
  "  saturation: 0.8,",
  "  brightness: 1,",
  "});",
  "const BackgroundOneColor2 = new Color({",
  "  hue: Math.random() * 360,",
  "  saturation: 0.8,",
  "  brightness: 1,",
  "});",
  "const BackgroundOneColor3 = new Color({",
  "  hue: Math.random() * 360,",
  "  saturation: 0.8,",
  "  brightness: 1,",
  "});",
  "const BackgroundOneColor4 = new Color({",
  "  hue: Math.random() * 360,",
  "  saturation: 0.8,",
  "  brightness: 1,",
  "});",
  "const ArrayBackgroundColorGradient = [",
  "  BackgroundColorGradient,",
  "  backgroundColor,",
  "  BackgroundOneColor,",
  "];",
  "const randomBackgroundColorGradient =",
  "  ArrayBackgroundColorGradient[Math.floor(Math.random() * ArrayBackgroundColorGradient.length)];",
  "const background = new Path.Rectangle({",
  "  point: [0, 0],",
  "  size: [view.size.width * 3, view.size.height * 3],",
  "  fillColor: new Color({",
  "    hue: Math.random() * 360,",
  "    saturation: 0.5,",
  "    brightness: 1,",
  "  }),",
  "  insert: true,",
  "});",
  "const radius = 1000;",
  "const startPoint = new Point(",
  "  view.size.width * randomMinMax(0.1, 0.9),",
  "  view.size.height * randomMinMax(0.1, 0.9)",
  ");",
  "const startPoint_2 = new Point(",
  "  view.size.width * randomMinMax(0.1, 0.9),",
  "  view.size.height * randomMinMax(0.1, 0.9)",
  ");",
  "const gradientRadius = radius * 0.3;",
  "const gradientEndPoint = startPoint.subtract(new Point(gradientRadius, gradientRadius));",
  "const gradientColor = new Color({",
  "  hue: Math.random() * 360,",
  "  saturation: 1,",
  "  brightness: 1,",
  "});",
  "const circle = new Path.Circle({",
  "  center: startPoint,",
  "  radius: radius,",
  "  fillColor: {",
  "    gradient: {",
  "      stops: [gradientColor, 'rgba(255, 255, 255, 0)'],",
  "      radial: true,",
  "    },",
  "    origin: startPoint,",
  "    destination: gradientEndPoint,",
  "  },",
  "  selected: false,",
  "});",
  "const secondGradientRadius = radius * 0.3",
  "const secondGradientEndPoint = startPoint_2.subtract(new Point(secondGradientRadius, secondGradientRadius));",
  "const secondCircle = new Path.Circle({",
  "  center: startPoint_2,",
  "  radius: radius,",
  "  fillColor: {",
  "    gradient: {",
  "      stops: [secondCircleGradientColor, 'rgba(255, 255, 255, 0)'],",
  "      radial: true,",
  "    },",
  "    origin: startPoint_2,",
  "    destination: secondGradientEndPoint,",
  "  },",
  "  selected: false,",
  "});",
  "function BackgroundRectangle() {",
  "  const width = view.size.width * randomMinMax(0.5, 0.8);",
  "  const height = view.size.height * randomMinMax(0.5, 0.8);",
  "  const Rectangle = new Path.Rectangle({",
  "    center: new Point(centerX, centerY),",
  "    width: width,",
  "    height: height,",
  "    fillColor: 'rgba(1,1,1,0.00001)',",
  "    draggable: true,",
  "  });",
  "  let dragging = false;",
  "  let offset = new paper.Point(0, 0);",
  "  let outsidePath;",
  "  function updateOutsidePath() {",
  "    if (outsidePath) {",
  "      outsidePath.remove();",
  "    }",
  "    outsidePath = Rectangle.exclude(background);",
  "    outsidePath.fillColor = randomBackgroundColorGradient;",
  "  }",
  "  Rectangle.onMouseDown = function (event) {",
  "    dragging = true;",
  "    offset = event.point.subtract(this.position);",
  "  };",
  "  Rectangle.onMouseDrag = function (event) {",
  "    if (dragging) {",
  "      this.position = event.point.subtract(offset);",
  "      updateOutsidePath();",
  "    }",
  "  };",
  "  Rectangle.onMouseUp = function (event) {",
  "    dragging = false;",
  "    updateOutsidePath();",
  "  };",
  "  paper.view.onClick = function (event) {",
  "    dragging = false;",
  "  };",
  "  updateOutsidePath();",
  "  return Rectangle;",
  "}",
  "function ShowBackgroundRectangle(x) {",
  "  if (Math.random() < x) {",
  "    BackgroundRectangle();",
  "  }",
  "}",
  "function BackgroundVerticalEllipse() {",
  "  const ellipse = new Path.Ellipse({",
  "    center: new Point(centerX, centerY),",
  "    size: [",
  "      view.size.width * randomMinMax(1.1, 1.5),",
  "      view.size.height * randomMinMax(0.7, 1.1),",
  "    ],",
  "    fillColor: 'rgba(1,1,1,0.00001)',",
  "    draggable: true,",
  "  });",
  "  let dragging = false;",
  "  let offset = new paper.Point(0, 0);",
  "  let outsidePath;",
  "  function updateOutsidePath2() {",
  "    if (outsidePath) {",
  "      outsidePath.remove();",
  "    }",
  "    outsidePath = ellipse.exclude(background);",
  "    outsidePath.fillColor = randomBackgroundColorGradient;",
  "  }",
  "  ellipse.onMouseDown = function (event) {",
  "    dragging = true;",
  "    offset = event.point.subtract(this.position);",
  "  };",
  "  ellipse.onMouseDrag = function (event) {",
  "    if (dragging) {",
  "      this.position = event.point.subtract(offset);",
  "      updateOutsidePath2();",
  "    }",
  "  };",
  "  ellipse.onMouseUp = function (event) {",
  "    dragging = false;",
  "    updateOutsidePath2();",
  "  };",
  "  paper.view.onClick = function (event) {",
  "    dragging = false;",
  "  };",
  "  updateOutsidePath2();",
  "  return ellipse;",
  "}",
  "function ShowBackgroundVerticalEllipse(x) {",
  "  if (Math.random() < x) {",
  "    BackgroundVerticalEllipse();",
  "  }",
  "}",
  "let trianglesGroup = [];",
  "const TrianglesColors = ['rgba(1,1,1,0.000001)', BackgroundOneColor3];",
  "const TrianglesRandomColor = TrianglesColors[Math.floor(Math.random() * TrianglesColors.length)];",
  "function createComplexLight() {",
  "  const center = new paper.Point(200, 200);",
  "  const triangles = [];",
  "  for (let i = 0; i < 10; i++) {",
  "    const size = randomMinMax(60, 100);",
  "    const point1 = center.add([0, -size / Math.sqrt(3)]);",
  "    const point2 = center.add([-size / 30, size / (2 * Math.sqrt(3))]);",
  "    const point3 = center.add([size / 30, size / (2 * Math.sqrt(3))]);",
  "    const triangle = new paper.Path();",
  "    triangle.add(point1);",
  "    triangle.add(point2);",
  "    triangle.add(point3);",
  "    triangle.closed = true;",
  "    const rotatedTriangle = triangle.clone();",
  "    rotatedTriangle.rotate(36 * i, rotatedTriangle.bounds.bottomCenter);",
  "    triangles.push(rotatedTriangle);",
  "  }",
  "  let unitedTriangles = triangles[0];",
  "  const TriangleIntermediatePath = [];",
  "  for (let i = 1; i < triangles.length; i++) {",
  "    unitedTriangles = unitedTriangles.unite(triangles[i]);",
  "    TriangleIntermediatePath.push(unitedTriangles);",
  "  }",
  "  for (let i = 0; i < triangles.length; i++) {",
  "    triangles[i].remove();",
  "  }",
  "  for (let i = 0; i < TriangleIntermediatePath.length - 1; i++) {",
  "    TriangleIntermediatePath[i].remove();",
  "  }",
  "  unitedTriangles.position = new paper.Point(randomMinMax(view.size.width * 0.1, view.size.width * 0.9), randomMinMax(view.size.height * 0.1, view.size.height * 0.9));",
  "  unitedTriangles.strokeColor = BackgroundOneColor3;",
  "  unitedTriangles.fillColor = TrianglesRandomColor;",
  "  unitedTriangles.strokeWidth = 2;",
  "  unitedTriangles.scaling = randomMinMax(0.5, 2.5);",
  "  let dragging = false;",
  "  let offset = new paper.Point(0, 0);",
  "  unitedTriangles.onMouseDown = function (event) {",
  "    dragging = true;",
  "    offset = event.point.subtract(this.position);",
  "  };",
  "  unitedTriangles.onMouseDrag = function (event) {",
  "    if (dragging) {",
  "      this.position = event.point.subtract(offset);",
  "    }",
  "  };",
  "  unitedTriangles.onMouseUp = function (event) {",
  "    dragging = false;",
  "  };",
  "  paper.view.onClick = function (event) {",
  "    dragging = false;",
  "  };",
  "  trianglesGroup.push(unitedTriangles);",
  "}",
  "function createUnitedComplexLight(index) {",
  "  if (index >= 6) return;",
  "  createComplexLight();",
  "  setTimeout(() => createUnitedComplexLight(index + 1), 200);",
  "}",
  "function ShowComplexLightLine(x) {",
  "  if (Math.random() < x) {",
  "    createUnitedComplexLight(0)",
  "  }",
  "}",
  "const EllipsesColors = ['rgba(1,1,1,0.00001)', BackgroundOneColor4];",
  "const EllipsesRandomColor = EllipsesColors[Math.floor(Math.random() * EllipsesColors.length)];",
  "const EllipseSizeX = randomMinMax(30, 100);",
  "const EllipseSizeY = randomMinMax(30, 100);",
  "function createEllipses() {",
  "  const numEllipses = 5;",
  "  const interval = 100;",
  "  const delay = 500;",
  "  let startPoint = new Point(centerX, centerY);",
  "  const ellipseGroup = new Group();",
  "  function createEllipseAt(point) {",
  "    const ellipse = new Path.Ellipse({",
  "      center: point,",
  "      size: [EllipseSizeX, EllipseSizeY],",
  "      fillColor: EllipsesRandomColor,",
  "      strokeColor: BackgroundOneColor4,",
  "      strokeWidth: 2,",
  "    });",
  "    ellipseGroup.addChild(ellipse);",
  "  }",
  "  function createEllipsesRecursively(index) {",
  "    if (index < numEllipses) {",
  "      const point = startPoint.add(new Point(interval * index, 0));",
  "      createEllipseAt(point);",
  "      setTimeout(function () {",
  "        createEllipsesRecursively(index + 1);",
  "      }, delay);",
  "    } else {",
  "      addDragAndDrop();",
  "    }",
  "  }",
  "  function addDragAndDrop() {",
  "    let dragging = false;",
  "    let offset = new paper.Point(0, 0);",
  "    ellipseGroup.onMouseDown = function (event) {",
  "      dragging = true;",
  "      offset = event.point.subtract(ellipseGroup.position);",
  "    };",
  "    ellipseGroup.onMouseDrag = function (event) {",
  "      if (dragging) {",
  "        ellipseGroup.position = event.point.subtract(offset);",
  "      }",
  "    };",
  "    ellipseGroup.onMouseUp = function (event) {",
  "      dragging = false;",
  "    };",
  "    paper.view.onClick = function (event) {};",
  "  }",
  "  createEllipsesRecursively(0);",
  "}",
  "function ShowEllipses(x) {",
  "  if (Math.random() < x) {",
  "    createEllipses();",
  "  }",
  "}",
  "function randomPoint() {",
  "  return new Point(",
  "    randomMinMax(view.size.width * 0.1, view.size.width * 0.9),",
  "    randomMinMax(view.size.height * 0.1, view.size.height * 0.9)",
  "  );",
  "}",
  "function drawLinesFromRandomPoint() {",
  "  const startPoint = randomPoint();",
  "  const lines = [];",
  "  for (let i = 0; i < 20; i++) {",
  "    const angle = randomMinMax(0, 2 * Math.PI);",
  "    const lineLength = randomMinMax(300, 700);",
  "    const endPoint = startPoint.add(",
  "      new Point({",
  "        length: lineLength,",
  "        angle: angle * (180 / Math.PI),",
  "      })",
  "    );",
  "    const line = new Path.Line({",
  "      from: startPoint,",
  "      to: endPoint,",
  "      strokeColor: BackgroundOneColor2,",
  "      strokeWidth: 10,",
  "    });",
  "    lines.push(line);",
  "    startPoint.x += randomMinMax(-10, 10);",
  "    startPoint.y += randomMinMax(-10, 10);",
  "  }",
  "  let dragging = false;",
  "  const group = new Group(lines);",
  "  group.onMouseDown = function (event) {",
  "    dragging = true;",
  "    this.startDragPoint = event.point.clone();",
  "  };",
  "  group.onMouseDrag = function (event) {",
  "    if (dragging) {",
  "      const delta = event.point.subtract(this.startDragPoint);",
  "      this.position = this.position.add(delta);",
  "      this.startDragPoint = event.point.clone();",
  "    }",
  "  };",
  "  group.onMouseUp = function (event) {",
  "    dragging = false;",
  "  };",
  "  return group;",
  "}",
  "function ShowLinesFromRandomPoint(x) {",
  "  if (Math.random() < x) {",
  "    const group = drawLinesFromRandomPoint();",
  "    view.draw();",
  "    return group;",
  "  }",
  "}",
  "var lastPoint;",
  "var circles = [];",
  "var initialStates = [];",
  "var path;",
  "var currentStep = 0;",
  "let isShowCirclesAlongPathNotCalled = true;",
  "const animationInterval = 30;",
  "const CircleBrushColor = new Color({",
  "  hue: Math.random() * 360,",
  "  saturation: 1,",
  "  brightness: 1,",
  "});",
  "function generateRandomPoints() {",
  "  const points = [];",
  "  for (let i = 0; i < randomMinMax(3, 10); i++) {",
  "    const x = view.size.width * randomMinMax(0, 1);",
  "    const y = view.size.height * randomMinMax(0, 1);",
  "    points.push(new Point(x, y));",
  "  }",
  "  return points;",
  "}",
  "function createPath(points) {",
  "  path = new Path({",
  "    segments: points,",
  "    closed: true,",
  "  });",
  "  return path;",
  "}",
  "function createCirclesAlongPath(path) {",
  "  const pathLength = path.length;",
  "  const stepSize = pathLength / 200;",
  "  function animate() {",
  "    var circleRadius = randomMinMax(70, 120);",
  "    if (currentStep >= pathLength) {",
  "      clearInterval(animationId);",
  "      enableCircleDragging();",
  "      return;",
  "    }",
  "    const point = path.getPointAt(currentStep);",
  "    const gradientEndPoint = point.add(",
  "      new Point(circleRadius * 0.5, circleRadius * 0.5)",
  "    );",
  "    var circle = new Path.Circle({",
  "      center: point,",
  "      radius: circleRadius,",
  "      fillColor: {",
  "        gradient: {",
  "          stops: [CircleBrushColor, 'rgba(255, 255, 255, 0)'],",
  "          radial: true,",
  "        },",
  "        origin: point,",
  "        destination: gradientEndPoint - 20,",
  "      },",
  "      selected: false,",
  "    });",
  "    circles.push(circle);",
  "    currentStep += stepSize;",
  "  }",
  "  const animationId = setInterval(animate, animationInterval);",
  "}",
  "function enableCircleDragging() {",
  "  let dragging = false;",
  "  let offset = new paper.Point(0, 0);",
  "  const group = new Group(circles);",
  "  group.onMouseDown = function (event) {",
  "    dragging = true;",
  "    offset = event.point.subtract(group.position);",
  "  };",
  "  group.onMouseDrag = function (event) {",
  "    if (dragging) {",
  "      group.position = event.point.subtract(offset);",
  "    }",
  "  };",
  "  group.onMouseUp = function (event) {",
  "    dragging = false;",
  "  };",
  "  paper.view.onClick = function (event) {",
  "    dragging = false;",
  "  };",
  "}",
  "function ShowCirclesAlongPath(x) {",
  "  if (Math.random() < x) {",
  "    const points = generateRandomPoints();",
  "    createPath(points);",
  "    createCirclesAlongPath(path);",
  "    isShowCirclesAlongPathNotCalled = false;",
  "  }",
  "}",
  "var lastPoint;",
  "var circles2 = [];",
  "var initialStates = [];",
  "var path2;",
  "var currentSet2 = 0;",
  "const animationInterval2 = 30",
  "const CircleBrushColor2 = 'white'",

  "function generateRandomPoints2() {",
  "  const points2 = []",
  "  for (let i = 0; i < randomMinMax(3, 5); i++) {",
  "    const x = view.size.width * randomMinMax(0, 1)",
  "    const y = view.size.height * randomMinMax(0, 1)",
  "    points2.push(new Point(x, y))",
  "  }",
  "  return points2",
  "}",

  "function createPath2(points2) {",
  "  path2 = new Path({",
  "    segments: points2,",
  "    closed: true,",
  "  })",
  "  return path2",
  "}",

  "function createCirclesAlongPath2(path2) {",
  "  const pathLength = path2.length",
  "  function animate() {",
  "    var circleRadius = randomMinMax(100, 170)",
  "    if (currentSet2 >= pathLength) {",
  "      clearInterval(animationId)",
  "      enableCircleDragging2()",
  "      return",
  "    }",
  "    const point = path2.getPointAt(currentSet2)",
  "    const gradientEndPoint = point.add(",
  "      new Point(circleRadius * 0.5, circleRadius * 0.5)",
  "    )",
  "    var circle2 = new Path.Circle({",
  "      center: point,",
  "      radius: circleRadius,",
  "      fillColor: {",
  "        gradient: {",
  "          stops: [CircleBrushColor2, 'rgba(255, 255, 255, 0)'],",
  "          radial: true,",
  "        },",
  "        origin: point,",
  "        destination: gradientEndPoint",
  "      },",
  "      selected: false",
  "    })",
  "    circles2.push(circle2)",
  "    currentSet2 += stepSize",
  "  }",
  "  const animationId = setInterval(animate, animationInterval2)",
  "}",

  "function enableCircleDragging2() {",
  "  let dragging = false",
  "  let offset = new paper.Point(0, 0)",
  "  const group = new Group(circles2)",
  "  group.onMouseDown = function (event) {",
  "    dragging = true",
  "    offset = event.point.subtract(group.position)",
  "  }",
  "  group.onMouseDrag = function (event) {",
  "    if (dragging) {",
  "      group.position = event.point.subtract(offset)",
  "    }",
  "  }",
  "  group.onMouseUp = function (event) {",
  "    dragging = false",
  "  }",
  "  paper.view.onClick = function (event) {",
  "    dragging = false",
  "  }",
  "}",
  "var lastPoint",
  "var circles3 = []",
  "var initialStates = []",
  "var path3",
  "var currentSet3 = 0",

  "const animationInterval3 = 30",
  "const CircleBrushColor3 = 'white'",

  "function generateRandomPoints3() {",
  "  const points3 = []",
  "  for (let i = 0; i < randomMinMax(4, 8); i++) {",
  "    const x = view.size.width * randomMinMax(0, 1)",
  "    const y = view.size.height * randomMinMax(0, 1)",
  "    points3.push(new Point(x, y))",
  "  }",
  "  return points3",
  "}",

  "function createPath3(points3) {",
  "  path3 = new Path({",
  "    segments: points3,",
  "    closed: true,",
  "  })",
  "  return path3",
  "}",

  "function createCirclesAlongPath3(path3) {",
  "  const pathLength = path3.length",
  "  function animate() {",
  "    var circleRadius = randomMinMax(75, 100)",
  "    if (currentSet3 >= pathLength) {",
  "      clearInterval(animationId)",
  "      enableCircleDragging3()",
  "      return",
  "    }",
  "    const point = path3.getPointAt(currentSet3)",
  "    const gradientEndPoint = point.add(",
  "      new Point(circleRadius * 0.5, circleRadius * 0.5)",
  "    )",
  "    var circle3 = new Path.Circle({",
  "      center: point,",
  "      radius: circleRadius,",
  "      fillColor: {",
  "        gradient: {",
  "          stops: [CircleBrushColor3, 'rgba(255, 255, 255, 0)'],",
  "          radial: true,",
  "        },",
  "        origin: point,",
  "        destination: gradientEndPoint",
  "      },",
  "      selected: false",
  "    })",
  "    circles3.push(circle3)",
  "    currentSet3 += stepSize",
  "  }",
  "  const animationId = setInterval(animate, animationInterval3)",
  "}",

  "function enableCircleDragging3() {",
  "  let dragging = false",
  "  let offset = new paper.Point(0, 0)",
  "  const group = new Group(circles3)",
  "  group.onMouseDown = function (event) {",
  "    dragging = true",
  "    offset = event.point.subtract(group.position)",
  "  }",
  "  group.onMouseDrag = function (event) {",
  "    if (dragging) {",
  "      group.position = event.point.subtract(offset)",
  "    }",
  "  }",
  "  group.onMouseUp = function (event) {",
  "    dragging = false",
  "  }",
  "  paper.view.onClick = function (event) {",
  "    dragging = false",
  "  }",
  "}",

  "let isShowCirclesAlongPath2NotCalled = false",
  "function ShowCirclesAlongPath2(x) {",
  "  if (isShowCirclesAlongPathNotCalled) {",
  "    if (Math.random() < x) {",
  "      const points = generateRandomPoints2()",
  "      createPath2(points)",
  "      createCirclesAlongPath2(path2)",
  "      isShowCirclesAlongPath2NotCalled = true",
  "    }",
  "  }",
  "}",
  "ShowCirclesAlongPath2(0.5)",

  "function ShowCirclesAlongPath3(x) {",
  "  if (isShowCirclesAlongPath2NotCalled) {",
  "    if (Math.random() < x) {",
  "      const points = generateRandomPoints3()",
  "      createPath3(points)",
  "      createCirclesAlongPath3(path3)",
  "    }",
  "  } else {",
  "    null",
  "  }",
  "}",
  "ShowCirclesAlongPath3(1)",
  "const funcArrayBackground = [BackgroundRectangle, BackgroundVerticalEllipse]",

  "const randomIndexBackground = Math.floor(",
  "  Math.random() * funcArrayBackground.length",
  ")",

  "funcArrayBackground[randomIndexBackground]()",

  "const randomX = Math.random() * view.size.width",
  "const randomY = Math.random() * view.size.height",

  "EffectContainer = new Path.Rectangle({",
  "  center: [",
  "    (randomMaxX - randomMinX) / 2 + randomMinX,",
  "    (randomMaxY - randomMinY) / 2 + randomMinY,",
  "  ],",
  "  size: [randomMaxX - randomMinX, randomMaxY - randomMinY],",
  "  fillColor: 'rgba(1,1,1,0.000001)',",
  "  strokeWidth: 5,",
  "})",

  "var EffectContainerCenter = EffectContainer.position",

  "var EffectPoint1 = new Point(",
  "var EffectPoint1 = new Point(",
  "EffectContainer.position.x - EffectContainer.bounds.width / 2,",
  "EffectContainer.position.y - EffectContainer.bounds.height / 2",
  ");",

  "var EffectPoint2 = new Point(",
  "EffectContainer.position.x + EffectContainer.bounds.width / 2,",
  "EffectContainer.position.y - EffectContainer.bounds.height / 2",
  ");",

  "var EffectPoint3 = new Point(",
  "EffectContainer.position.x + EffectContainer.bounds.width / 2,",
  "EffectContainer.position.y + EffectContainer.bounds.height / 2",
  ");",

  "function updateEffectContainerBounds() {",

  "EffectContainerCenter = EffectContainer.position",

  "EffectPoint1 = new Point(",
  "EffectContainer.position.x - EffectContainer.bounds.width / 2,",
  "EffectContainer.position.y - EffectContainer.bounds.height / 2",
  ");",

  "EffectPoint2 = new Point(",
  "EffectContainer.position.x + EffectContainer.bounds.width / 2,",
  "EffectContainer.position.y - EffectContainer.bounds.height / 2",
  ");",

  "EffectPoint3 = new Point(",
  "EffectContainer.position.x + EffectContainer.bounds.width / 2,",
  "EffectContainer.position.y + EffectContainer.bounds.height / 2",
  ");",

  "MiniCircles.forEach((circle) => {",
  "circle.position.x = randomMinMax(",
  "EffectContainer.bounds.left + 20,",
  "EffectContainer.bounds.right - 20",
  ");",
  "circle.position.y = randomMinMax(",
  "EffectContainer.bounds.top + 20,",
  "EffectContainer.bounds.bottom - 20",
  ");",
  "});",
  "}",

  "const MiniCircles = [];",
  "const numMiniCircles = 30;",

  "function MiniCircleAnimated() {",
  "for (let i = MiniCircles.length; i < numMiniCircles; i++) {",
  "const baseRadius = 5;",
  "const radius = baseRadius * randomMinMax(0.05, 1.95);",
  "const MiniCircleColor = backgroundColor;",
  "const MiniCircle = new Path.Circle({",
  "center: new Point(",
  "randomMinMax(EffectContainer.bounds.left + 20, EffectContainer.bounds.right - 20),",
  "randomMinMax(EffectContainer.bounds.top + 20, EffectContainer.bounds.bottom - 20)",
  "),",
  "radius: radius,",
  "fillColor: ParticleColor,",
  "});",
  "MiniCircle.data = {",
  "amplitude: randomMinMax(0.5, 2.5),",
  "frequency: randomMinMax(0.005, 0.025),",
  "offset: new Point(randomMinMax(-5, 5), randomMinMax(-5, 5)),",
  "angle: Math.random() * Math.PI * 2,",
  "};",
  "MiniCircles.push(MiniCircle);",
  "}",
  "MiniCircles.forEach((circle) => {",
  "const { amplitude, frequency, offset, angle } = circle.data;",
  "const delta = new Point(",
  "Math.sin(angle * frequency) * amplitude,",
  "Math.cos(angle * frequency) * amplitude",
  ");",
  "circle.position = circle.position.add(delta);",
  "circle.position = circle.position.add(offset);",
  "if (circle.position.x > EffectPoint2.x - 10) {",
  "circle.position.x = EffectPoint1.x + 10;",
  "} else if (circle.position.x < EffectPoint1.x + 10) {",
  "circle.position.x = EffectPoint2.x - 10;",
  "}",
  "if (circle.position.y > EffectPoint3.y - 10) {",
  "circle.position.y = EffectPoint1.y + 10;",
  "} else if (circle.position.y < EffectPoint1.y + 10) {",
  "circle.position.y = EffectPoint3.y - 10;",
  "}",
  "circle.data.angle += 0.03;",
  "circle.strokeColor = 'black';",
  "});",
  "}",
  "let lightGroups = [];",
  "let createLightInterval = null;",

  "function createLight() {",
  "const center = new paper.Point(200, 200);",
  "const size = 100;",

  "const point1 = center.add([0, -size / Math.sqrt(3)]);",
  "const point2 = center.add([-size / 30, size / (2 * Math.sqrt(3))]);",
  "const point3 = center.add([size / 30, size / (2 * Math.sqrt(3))]);",

  "const triangle = new paper.Path();",
  "triangle.add(point1);",
  "triangle.add(point2);",
  "triangle.add(point3);",
  "triangle.closed = true;",
  "triangle.fillColor = 'black';",

  "const triangles = [];",

  "for (let i = 0; i < 4; i++) {",
  "const rotatedTriangle = triangle.clone();",
  "rotatedTriangle.rotate(90 * i, rotatedTriangle.bounds.bottomCenter);",
  "triangles.push(rotatedTriangle);",
  "}",

  "let unitedTriangles = triangles[0];",
  "const TriangleIntermediatePath = [];",

  "for (let i = 1; i < triangles.length; i++) {",
  "unitedTriangles = unitedTriangles.unite(triangles[i]);",
  "TriangleIntermediatePath.push(unitedTriangles);",
  "}",

  "for (let i = 0; i < triangles.length; i++) {",
  "triangles[i].remove();",
  "}",

  "for (let i = 0; i < TriangleIntermediatePath.length - 1; i++) {",
  "TriangleIntermediatePath[i].remove();",
  "}",

  "const LightCircleCenter = unitedTriangles.bounds.center;",
  "const LightCircleGradientRadius = 40;",
  "const gradient = {",
  "gradient: {",
  "stops: ['white', 'rgba(255, 255, 255, 0)'],",
  "radial: true,",
  "},",
  "origin: LightCircleCenter,",
  "destination: LightCircleCenter.add([LightCircleGradientRadius, 0]),",
  "};",
  "const whiteCircle = new paper.Path.Circle(",
  "LightCircleCenter,",
  "LightCircleGradientRadius",
  ");",
  "whiteCircle.fillColor = gradient;",

  "unitedTriangles.fillColor = 'white';",
  "triangle.remove();",

  "const lightGroup = new paper.Group([unitedTriangles, whiteCircle]);",

  "lightGroup.scaling = new paper.Point(0.1, 0.1);",

  "lightGroup.position = new paper.Point(",
  "randomMinMax(EffectPoint1.x + 20, EffectPoint2.x - 20),",
  "randomMinMax(EffectPoint1.y + 20, EffectPoint3.y - 20)",
  ");",

  "lightGroup.initialScale = new paper.Point(1.1, 1.1);",
  "lightGroup.LightScaleFactor = randomMinMax(0.1, 0.7);",
  "lightGroup.scalingDirection = 1;",
  "lightGroup.maxLightScaleFactor = 1.5;",
  "lightGroup.scaleSpeed = 0.2;",

  "lightGroups.push(lightGroup);",
  "}",

  "function LightAnimated() {",
  "lightGroups.forEach((lightGroup, index) => {",
  "const initialScale = lightGroup.initialScale.clone();",
  "let LightScaleFactor = lightGroup.LightScaleFactor;",
  "let scalingDirection = lightGroup.scalingDirection;",
  "const maxLightScaleFactor = lightGroup.maxLightScaleFactor;",
  "const scaleSpeed = lightGroup.scaleSpeed;",

  "LightScaleFactor += scaleSpeed * scalingDirection;",

  "if (LightScaleFactor >= maxLightScaleFactor) {",
  "LightScaleFactor = maxLightScaleFactor;",
  "scalingDirection = -1;",
  "} else if (LightScaleFactor <= 0.1) {",
  "lightGroup.remove();",
  "lightGroups.splice(index, 1);",
  "return;",
  "}",

  "lightGroup.scaling = initialScale.multiply(LightScaleFactor);",

  "lightGroup.LightScaleFactor = LightScaleFactor;",
  "lightGroup.scalingDirection = scalingDirection;",
  "});",

  "if (!createLightInterval) {",
  "createLightInterval = setInterval(createLight, 50);",
  "}",
  "}",

  "const funcArrayRandomEffect = [MiniCircleAnimated, LightAnimated];",

  "const randomIndexEffect = Math.floor(Math.random() * funcArrayRandomEffect.length);",

  "function onFrame(event) {",
  "const scaleFactor2 = Math.max(Math.sin(event.time) * 0.03 + 1.0, 0.5);",
  "const wiggleAmount2 = Math.sin(event.time) * 10;",
  "secondCircle.scale(scaleFactor2);",
  "secondCircle.position.x += randomMinMax(-wiggleAmount2, wiggleAmount2);",
  "secondCircle.position.y += randomMinMax(-wiggleAmount2, wiggleAmount2);",
  "const secondCircleGradientColor = new Color({",
  "hue: Math.random() * 360,",
  "saturation: 1,",
  "brightness: 1,",
  "});",

  "const scaleFactor = Math.max(Math.sin(event.time) * 0.03 + 1.0, 0.5);",
  "const wiggleAmount = Math.sin(event.time) * 10;",
  "circle.scale(scaleFactor);",
  "circle.position.x += randomMinMax(-wiggleAmount, wiggleAmount);",
  "circle.position.y += randomMinMax(-wiggleAmount, wiggleAmount);",

  "funcArrayRandomEffect[randomIndexEffect]();",
  "}",
  'view.on("frame", onFrame)',
  "ShowEllipses(0.3)",
  "ShowComplexLightLine(0.3)",

  "ShowLinesFromRandomPoint(0.3)",

  "function drawRandomOutline() {",
  "const viewWidth = view.size.width;",
  "const viewHeight = view.size.height;",

  "const side = Math.floor(Math.random() * 4);",

  "const lineWidth = randomMinMax(100, 300);",

  "let from, to;",

  "switch (side) {",
  "case 0:",
  "from = new Point(0, 0);",
  "to = new Point(viewWidth, 0);",
  "break;",
  "case 1:",
  "from = new Point(viewWidth, 0);",
  "to = new Point(viewWidth, viewHeight);",
  "break;",
  "case 2:",
  "from = new Point(0, viewHeight);",
  "to = new Point(viewWidth, viewHeight);",
  "break;",
  "case 3:",
  "from = new Point(0, 0);",
  "to = new Point(0, viewHeight);",
  "break;",
  "}",

  "const LineColors = [",
  '"blue",',
  '"red",',
  '"black",',
  '"white",',
  '"green",',
  '"yellow",',
  '"purple"',
  "];",

  "const randomLineColor = LineColors[Math.floor(Math.random() * LineColors.length)];",

  "const line = new Path.Line({",
  "from: from,",
  "to: to,",
  "strokeColor: randomLineColor,",
  "strokeWidth: lineWidth",
  "});",

  "return line;",
  "}",
  "function ShowRandomOutLine(x) {",
  "if (Math.random() < x) {",
  "drawRandomOutline();",
  "}",
  "}",
  'const colors = ["blue", "red", "black"];',
  "const randomColor = colors[Math.floor(Math.random() * colors.length)];",

  "function drawRandomBox() {",
  "const viewWidth = view.size.width;",
  "const viewHeight = view.size.height;",

  "const BackgroundColorGradient = {",
  "gradient: {",
  "stops: [",
  "[",
  "new Color({",
  "hue: Math.random() * 360,",
  "saturation: 0.8,",
  "brightness: 1,",
  "}),",
  "0,",
  "],",
  '["white", 1],',
  "],",
  "radial: false,",
  "},",
  "origin: new Point(0, view.size.height / 2),",
  "destination: new Point(view.size.width, view.size.height / 2),",
  "};",

  "const BackgroundOneColor = new Color({",
  "hue: Math.random() * 360,",
  "saturation: 0.9,",
  "brightness: 1,",
  "});",

  'const colors = ["white", BackgroundColorGradient, BackgroundOneColor];',

  "const randomColor = colors[Math.floor(Math.random() * colors.length)];",

  "const boxWidth = randomMinMax(viewWidth * 0.5, viewWidth * 0.8);",
  "const boxHeight = viewHeight;",
  "const boxX = Math.random() < 0.5 ? 0 : viewWidth - boxWidth;",
  "const boxY = 0;",

  "const box = new Path.Rectangle({",
  "point: [boxX, boxY],",
  "size: [boxWidth, boxHeight],",
  "fillColor: randomColor,",
  "});",

  "return box;",
  "}",

  "function ShowRandomBox(x) {",
  "if (Math.random() < x) {",
  "drawRandomBox();",
  "}",
  "}",

  "ShowRandomOutLine(0.3);",
  "ShowRandomBox(0.3);",
  "const canvasWidth = view.size.width;",
  "const canvasHeight = view.size.height;",
  "const fontSize = 50;",
  'const fontFamily = "arial";',

  "function getRandomPosition(width, height) {",
  "const x = Math.random() * (canvasWidth - width);",
  "const y = Math.random() * (canvasHeight - height);",
  "return new Point(x, y);",
  "}",

  "function scalePath(path, scale) {",
  "path.scale(scale);",
  "}",

  "var randomIndex = Math.floor(Math.random() * codeLines.length);",
  "var randomLine = codeLines[randomIndex];",

  "var group = new Group();",

  'var context = myCanvas.getContext("2d");',
  "context.font = `${fontSize}px ${fontFamily}`;",

  "var xOffset = 0;",
  "for (var i = 0; i < randomLine.length; i++) {",
  "var char = randomLine[i];",
  "var width = context.measureText(char).width;",

  "context.clearRect(0, 0, myCanvas.width, myCanvas.height);",
  "context.fillText(char, 0, 100);",
  "var imageData = context.getImageData(0, 0, width, 200);",

  "var textPath = new Path();",
  "for (var y = 0; y < imageData.height; y++) {",
  "for (var x = 0; x < width; x++) {",
  "var index = (y * imageData.width + x) * 4;",
  "var alpha = imageData.data[index + 3];",
  "if (alpha > 0) {",
  "textPath.add(new Point(x + xOffset, y));",
  "}",
  "}",
  "}",
  "textPath.smooth();",
  'textPath.strokeColor = "black";',
  "group.addChild(textPath);",

  "xOffset += width;",
  "}",
  "var randomPosition = [",
  "randomMinMax(view.size.width * 0.3, view.size.width * 0.7),",
  "randomMinMax(view.size.height * 0.3, view.size.height * 0.7),",
  "];",

  "group.position = randomPosition",

  "group.scale(randomMinMax(0.5, 1.5))",
  'group.strokeColor = "black"',
  "group.closed = false",

  "let isDragging = false",
  "let textOffset = new Point(0, 0)",

  "group.onMouseDown = function (event) {",
  "isDragging = true",
  "textOffset = event.point.subtract(group.position)",
  "}",

  "group.onMouseDrag = function (event) {",
  "if (isDragging) {",
  "group.position = event.point.subtract(textOffset)",
  "}",
  "}",

  "group.onMouseUp = function (event) {",
  "isDragging = false",
  "}",

  "function createClickButton() {",
  'const BlackWhiteColors = ["white", "black"]',
  "const BlackWhiteRandomColor =",
  "BlackWhiteColors[Math.floor(Math.random() * BlackWhiteColors.length)]",

  'const colors = ["red", "yellow", "green", "blue", "violet"]',
  "const randomColor = colors[Math.floor(Math.random() * colors.length)]",

  "const ClickEllipses = []",
  "const numClickEllipses = randomMinMax(1, 5)",
  "const intervalX = randomMinMax(-100, 100)",
  "const intervalY = randomMinMax(-100, 100)",
  "const ClickButtonDelay = 3000",
  "const groupScale = randomMinMax(0.2, 0.7)",

  "let ClickButtonStartPoint = new Point(",
  "Math.random() * view.size.width,",
  "Math.random() * view.size.height",
  ")",

  "function createEllipseAt(point) {",
  "const ellipse = new Path.Ellipse({",
  "center: point,",
  "size: [200, 100],",
  "fillColor: secondCircleGradientColor,",
  "strokeColor: BlackWhiteRandomColor,",
  "strokeWidth: 2,",
  "})",

  "const text = new PointText({",
  "point: point,",
  'content: "Click!",',
  'justification: "center",',
  "fillColor: BlackWhiteRandomColor,",
  "fontSize: 30,",
  'fontFamily: "Arial",',
  "})",

  "const group = new Group([ellipse, text])",
  "group.scale(groupScale)",

  "const rotation = [90, 180, -90, 0]",
  "const ClickRotation = rotation[Math.floor(Math.random() * rotation.length)]",

  "group.rotate(ClickRotation)",

  "group.onClick = function (event) {",
  "location.reload()",
  "}",

  "ClickEllipses.push(group)",
  "}",

  "function createClickButtonRecursively(index, currentPoint) {",
  "if (index < numClickEllipses) {",
  "createEllipseAt(currentPoint)",

  "const nextPoint = currentPoint.add(new Point(intervalX, -intervalY))",

  "setTimeout(function () {",
  "createClickButtonRecursively(index + 1, nextPoint)",
  "}, ${ClickButtonDelay})",
  "}",
  "}",

  "createClickButtonRecursively(0, ClickButtonStartPoint)",
]
const canvasWidth = view.size.width
const canvasHeight = view.size.height
const fontSize = 50
const fontFamily = "arial"

// 랜덤 위치 설정 함수
function getRandomPosition(width, height) {
  const x = Math.random() * (canvasWidth - width)
  const y = Math.random() * (canvasHeight - height)
  return new Point(x, y)
}

// 텍스트 크기 변경 함수
function scalePath(path, scale) {
  path.scale(scale)
}

// 임의의 코드 줄 선택
var randomIndex = Math.floor(Math.random() * codeLines.length)
var randomLine = codeLines[randomIndex]

var group = new Group()

// HTML5 canvas에 텍스트 그리기
var context = myCanvas.getContext("2d")
context.font = `${fontSize}px ${fontFamily}`

// 각 문자를 독립된 경로로 처리
var xOffset = 0
for (var i = 0; i < randomLine.length; i++) {
  var char = randomLine[i]
  var width = context.measureText(char).width

  // 문자를 개별적으로 그림
  context.clearRect(0, 0, myCanvas.width, myCanvas.height)
  context.fillText(char, 0, 100)
  var imageData = context.getImageData(0, 0, width, 200)

  var textPath = new Path()
  for (var y = 0; y < imageData.height; y++) {
    for (var x = 0; x < width; x++) {
      var index = (y * imageData.width + x) * 4
      var alpha = imageData.data[index + 3]
      if (alpha > 0) {
        textPath.add(new Point(x + xOffset, y))
      }
    }
  }
  textPath.smooth()
  textPath.strokeColor = "black"
  group.addChild(textPath)

  xOffset += width
}

// 랜덤 위치 설정
var randomPosition = [
  randomMinMax(view.size.width * 0.3, view.size.width * 0.7),
  randomMinMax(view.size.height * 0.3, view.size.height * 0.7),
] // 200은 텍스트 높이의 대략적인 값
group.position = randomPosition

// 텍스트 크기 변경 (여기서 1.5는 크기 배율)
group.scale(randomMinMax(0.5, 1.5))
group.strokeColor = "black"
//group.fillColor=secondCircleGradientColor
group.closed = false

// 드래그 기능 추가
let isDragging = false
let textOffset = new Point(0, 0)

group.onMouseDown = function (event) {
  isDragging = true
  textOffset = event.point.subtract(group.position)
}

group.onMouseDrag = function (event) {
  if (isDragging) {
    group.position = event.point.subtract(textOffset)
  }
}

group.onMouseUp = function (event) {
  isDragging = false
}

function createClickButton() {
  const BlackWhiteColors = ["white", "black"]
  // 무작위로 색상 선택
  const BlackWhiteRandomColor =
    BlackWhiteColors[Math.floor(Math.random() * BlackWhiteColors.length)]

  const colors = ["red", "yellow", "green", "blue", "violet"]
  // 무작위로 색상 선택
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  const ClickEllipses = []
  const numClickEllipses = randomMinMax(1, 5) // 생성할 타원의 개수
  const intervalX = randomMinMax(-100, 100) // 타원 간의 간격 (X축)
  const intervalY = randomMinMax(-100, 100) // 타원 간의 간격 (Y축)
  const ClickButtonDelay = 3000 // 타원 생성 간의 딜레이(ms)
  const groupScale = randomMinMax(0.2, 0.7)
  // 랜덤한 시작점 설정
  let ClickButtonStartPoint = new Point(
    Math.random() * view.size.width,
    Math.random() * view.size.height
  )

  // 타원을 생성하는 함수
  function createEllipseAt(point) {
    const ellipse = new Path.Ellipse({
      center: point,
      size: [200, 100], // 타원의 크기 (가로, 세로)
      fillColor: secondCircleGradientColor,
      strokeColor: BlackWhiteRandomColor,
      strokeWidth: 2,
    })

    // 텍스트 추가
    const text = new PointText({
      point: point,
      content: "Click!",
      justification: "center",
      fillColor: BlackWhiteRandomColor,
      fontSize: 30,
      fontFamily: "Arial",
    })

    // 타원과 텍스트를 그룹화
    const group = new Group([ellipse, text])
    group.scale(groupScale)

    const rotation = [90, 180, -90, 0]
    const ClickRotation = rotation[Math.floor(Math.random() * rotation.length)]

    group.rotate(ClickRotation)
    // 클릭 이벤트 핸들러 추가
    group.onClick = function (event) {
      location.reload() // 페이지 새로고침
    }

    ClickEllipses.push(group)
  }

  // 재귀적으로 타원을 생성하는 함수
  function createClickButtonRecursively(index, currentPoint) {
    if (index < numClickEllipses) {
      createEllipseAt(currentPoint)

      // 다음 타원의 중심점 계산
      const nextPoint = currentPoint.add(new Point(intervalX, -intervalY))

      // 다음 타원을 생성하기 위한 setTimeout 호출
      setTimeout(function () {
        createClickButtonRecursively(index + 1, nextPoint)
      }, ClickButtonDelay)
    }
  }

  // 애니메이션 시작
  createClickButtonRecursively(0, ClickButtonStartPoint)
}

createClickButton()
