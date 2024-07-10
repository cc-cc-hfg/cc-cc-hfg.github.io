//Yunfei Zhang

//create a synth and connect it to the main output (your speakers)

//background rgb(104,61,191)
let rect = new Path.Rectangle({
  point: [0, 0],
  size: [view.size.width / 0.1, view.size.height / 0.1],
  strokeColor: "green",
  fillColor: "rgb(104,61,191)",
})
rect.sendToBack()

const synth = new Tone.Synth().toDestination()
let myPath

function onMouseDown(event) {
  myPath = new Path({ strokeColor: "rgb(0,0,51)", strokeWidth: 25 })

  // create two monophonic synths
  const synthA = new Tone.FMSynth().toDestination()
  const synthB = new Tone.AMSynth().toDestination()
  //play a note every quarter-note
  const loopA = new Tone.Loop((time) => {
    synthA.triggerAttackRelease("C2", "8n", time)
  }, "4n").start(1)
  //play another note every off quarter-note, by starting it "8n"
  const loopB = new Tone.Loop((time) => {
    synthB.triggerAttackRelease("C4", "8n", time)
  }, "4n").start("8n")
  // all loops start when the Transport is started
  Tone.getTransport().start()
  // ramp up to 800 bpm over 10 seconds
  Tone.getTransport().bpm.rampTo(80, 5)

  const filter = new Tone.Filter(400, "lowpass").toDestination()
  const feedbackDelay = new Tone.FeedbackDelay(0.125, 0.5).toDestination()

  synthA.connect(filter)
  synthB.connect(feedbackDelay)
}

function onMouseDrag(event) {
  myPath.add(event.point)
}

function onMouseUp(event) {
  for (let i = 0; i < 18; i++) {
    let myCircle = new Path.Circle({
      radius: 15,
      center: event.point,
    })

    myCircle.pivot = [150, 200]
    myCircle.rotate((360 / 18) * i)

    myCircle.strokeColor = "rgb(22,249,128)"
    myCircle.fillColor = "red"
    //rgb(22,249,128)
    myCircle.blendMode = "screen"
  }
}

let text = new PointText({
  point: [50, 50],
  content:
    "Please turn up the volume and slowly click and drag the mouse as many times as you can to listen for changes in sound vibration.",
  fillColor: "rgb(255,195,255)",
  fontFamily: "Courier New",
  fontWeight: "bold",
  fontSize: 17,
})
