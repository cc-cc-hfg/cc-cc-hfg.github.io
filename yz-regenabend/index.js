//Yunfei Zhang

//background rgb(25,30,92)
let rect = new Path.Rectangle({
  point: [0, 0],
  size: [view.size.width / 0.1, view.size.height / 0.1],
  strokeColor: "green",
  fillColor: "rgb(25,30,92)",
})
rect.sendToBack()

//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination()
let myPath

function onMouseDown(event) {
  myPath = new Path({ strokeColor: "rgb(22,249,128)", strokeWidth: 15 })

  const synth = new Tone.PolySynth(Tone.Synth).toDestination()
  const now = Tone.now()
  synth.triggerAttack("D3", now)
  synth.triggerAttack("F4", now + 0.5)
  synth.triggerAttack("A4", now + 0.5)
  synth.triggerAttack("C5", now + 0.5)
  synth.triggerAttack("E7", now + 0.5)
  synth.triggerRelease(["D3", "F4", "A4", "C5", "E7"], now + 1)

  const filter = new Tone.Filter(400, "lowpass").toDestination()
  const feedbackDelay = new Tone.FeedbackDelay(0.125, 0.5).toDestination()

  synth.connect(filter)
  synth.connect(feedbackDelay)
}

function onMouseDrag(event) {
  myPath.add(event.point)
}

function onMouseUp(event) {
  for (let i = 0; i < 18; i++) {
    for (let j = 0; j < 10; j++) {
      let myCircle = new Path.Circle({
        radius: 10,
        center: event.point,
      })

      myCircle.pivot = [6000, 0]
      myCircle.rotate((360 / 1000) * i)
      myCircle.rotate(j * i * 1)

      myCircle.strokeColor = "blue"
      myCircle.fillColor = "rgb(22,249,128)"
      myCircle.blendMode = "screen"
    }
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
