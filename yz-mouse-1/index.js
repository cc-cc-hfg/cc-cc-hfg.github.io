//Yunfei Zhang
//background rgb(104,61,191)
let rect = new Path.Rectangle({
  point: [0, 0],
  size: [view.size.width / 0.1, view.size.height / 0.1],
  strokeColor: "green",
  fillColor: "rgb(104,61,191)",
})
rect.sendToBack()

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination()
let myPath

function onMouseDown(event) {
  myPath = new Path({ strokeColor: "rgb(186,253,0)", strokeWidth: 25 })

  const osc = new Tone.Oscillator().toDestination()
  // start at "C4"
  osc.frequency.value = "B7"
  // ramp to "C2" over - seconds
  osc.frequency.rampTo("B2", 1)
  // start the oscillator for - seconds
  osc.start().stop("+1")
  const filter = new Tone.Filter(400, "lowpass").toDestination()
  const feedbackDelay = new Tone.FeedbackDelay(0.125, 0.5).toDestination()

  osc.connect(filter)
  osc.connect(feedbackDelay)
}

function onMouseDrag(event) {
  myPath.add(event.point)
}

function onMouseUp(event) {
  let myCircle = new Path.Star({
    points: 10,
    center: event.point,
    radius1: 50,
    radius2: 10,
  })
  /////////// 旋转 rotate

  const numTriangles = 60
  for (let i = 0; i < numTriangles; i++) {
    const angle = (360 / numTriangles) * i
    const clone = myCircle.clone()
    clone.rotate(angle)

    myCircle.strokeColor = "blue"
    myCircle.fillColor = "rgb(22,249,128)"
    myCircle.blendMode = "screen"
  }
}

let text = new PointText({
  point: [50, 50],
  content: "Please turn up the volume, click and drag the mouse",
  fillColor: "rgb(242,247,158)",
  fontFamily: "Courier New",
  fontWeight: "bold",
  fontSize: 25,
})
