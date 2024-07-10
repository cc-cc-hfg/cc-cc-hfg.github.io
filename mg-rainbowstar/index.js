// Utility function to generate random number between min and max
function randomMinMax(min, max) {
  return Math.random() * (max - min) + min
}

// The parameters that we want to change with tweakpane
const params = {
  radius1: 150,
  radius2: 100,
  color: "rgb(255,255,0)",
  rotation: 0,
  position: view.center.clone(),
}

// Function to draw the star with face
function draw() {
  project.activeLayer.removeChildren()

  // Draw the star
  const star = new Path.Star({
    center: params.position,
    points: 10,
    radius1: params.radius1,
    radius2: params.radius2,
    fillColor: params.color,
    strokeColor: "blue",
    strokeWidth: 2,
  })

  // Draw the circles at the star points
  for (let i = 0; i < 10; i++) {
    const angle = (i * 360) / 10 - 90
    const point =
      star.bounds.center +
      new Point({
        length: params.radius1,
        angle,
      })
    new Path.Circle({
      center: point,
      radius: 10,
      fillColor: new Color({
        hue: (i * 36 + params.rotation) % 360,
        saturation: 1,
        brightness: 1,
      }),
      strokeWidth: 2,
      strokeColor: "blue",
    })
  }

  // Draw eyes
  const eye1 = new Path.Circle({
    center: star.position + new Point(-30, -20),
    radius: 10,
    fillColor: "hotpink",
    strokeColor: "hotpink",
    strokeWidth: 2,
  })

  const eye2 = new Path.Circle({
    center: star.position + new Point(30, -20),
    radius: 10,
    fillColor: "hotpink",
    strokeColor: "hotpink",
    strokeWidth: 2,
  })

  // Draw mouth
  const mouth = new Path({
    segments: [
      star.position + new Point(-30, 20),
      star.position + new Point(0, 35),
      star.position + new Point(30, 20),
    ],
    strokeColor: "hotpink",
    strokeWidth: 3,
  })
  mouth.smooth({ type: "continuous" })

  // Group all elements
  const face = new Group([eye1, eye2, mouth])
  const group = new Group([star, face])

  // Animate the star group when clicked
  group.on("click", function () {
    group.tween(
      {
        rotation: group.rotation + 180,
        position: new Point(
          randomMinMax(100, view.bounds.width - 100),
          randomMinMax(100, view.bounds.height - 100)
        ),
        fillColor: {
          hue: group.fillColor.hue + 90,
        },
      },
      {
        duration: 2000,
        easing: "easeInOutCubic",
      }
    )
  })

  // Ensure the face remains centered and scaled with the star
  face.scaling = new Point(1, 1).multiply(Math.min(params.radius2 / 100, 1))
  face.position = star.position
}

// Draw the star the first time
draw()

// Create a new tweakpane and redraw the star each time we change the parameters
const pane = new Pane()
pane.addBinding(params, "color")
pane.addBinding(params, "radius1", { min: 50, max: 200 }).on("change", draw)
pane.addBinding(params, "radius2", { min: 50, max: 150 }).on("change", draw)
pane.addBinding(params, "rotation", { min: 0, max: 360 }).on("change", draw)
pane
  .addBinding(params, "position", {
    x: { min: 0, max: view.size.width },
    y: { min: 0, max: view.size.height },
  })
  .on("change", draw)

// Add a small hint
new PointText({
  content: "Click on the star",
  position: [100, 50],
  fillColor: "blue",
  fontFamily: "Arial",
  fontSize: 20,
})
