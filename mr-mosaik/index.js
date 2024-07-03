var myPath = new Path()
myPath.strokeColor = "black"
myPath.strokeWidth = 2
myPath.closed = true
myPath.fillColor = "#7e44ee66"

const params = { amplitude: 1 }

function updateAmplitude(event) {
  const amplitude = Math.sin(event.time) * 2 + 2
  params.amplitude = amplitude
}

const clicks = []

function onMouseDown(event) {
  if (event.point) clicks.push(event.point)
  draw()
}

function draw() {
  myPath.segments = []
  if (!clicks.length) return

  for (let i = 0; i < clicks.length; i++) {
    const click = clicks[i]
    const isEven = i % 2 === 0
    const center = new Point(click.x, view.center.y)
    const distance = center - click

    if (isEven) {
      myPath.add(center + distance * params.amplitude)
    } else {
      myPath.add(center + distance * params.amplitude * -1)
    }
  }

  for (let i = 0; i < clicks.length; i++) {
    const click = clicks[clicks.length - i - 1]
    const isEven = i % 2 === 0
    const isEvenClicks = clicks.length % 2 === 0
    const isTop = isEvenClicks ? isEven : !isEven
    const center = new Point(click.x, view.center.y)
    const distance = center - click

    if (isTop) {
      myPath.add(center + distance * params.amplitude)
    } else {
      myPath.add(center + distance * params.amplitude * -1)
    }
  }

  myPath.simplify()
}

// Die Idee ist, dass der erstellte Pfad entlang der y-Achse pulsiert.
// In einem ersten Versuch hatte ich es geschaffte, den gesamten Pfad über "scale" pulsieren zu lassen, über "scale.y" dann auch entsprechend nur entlang der y-Achse.
// Dadurch hat sich der ganze Code dann aber komplett anders verhalten und die Symmetrie-Achse hat sich mit jedem Klick anders verschoben.

// Einen zweiten und dritten Versuch siehst du unten, der Code funktioniert zwar so jetzt, aber die Ampluitude wird immer nur bei klicks aktualisiert.
// Ich bekomme es aber nicht hin, dass der entstandene Pfad konstant pulsiert.

// function onFrame(event) {
//   for (var i = 0; i < myPath.segments.length; i++) {
//     let segment = path.segment.segments[i]
//     segment.point.y = newYValues[i]
//   }
// }

function onFrame(event) {
  updateAmplitude(event)
  draw()
}

paper.view.update()

document.addEventListener("keydown", function (event) {
  if (event.code === "Enter") {
    location.reload()
  }
})

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
