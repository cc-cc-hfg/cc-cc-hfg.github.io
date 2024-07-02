//circle gradient mouse click
const group = new Group()
tool.maxDistance = 1000

let promptText = new PointText({
  point: view.center,
  justification: "center",
  fillColor: "black",
  fontSize: 20,
  content: "Click to draw",
})

// Function to remove the prompt text
function removePromptText() {
  if (promptText) {
    promptText.remove()
    promptText = null
  }
}

function createCircle(x, y) {
  const circleRadius = 20 // Adjust circle size as needed

  const circle = new Path.Circle({
    fillColor: {
      gradient: {
        stops: ["white", "black", "grey", "black"],
        radial: true,
      },
      origin: [x, y],
      destination: [x, y + circleRadius],
    },
    radius: circleRadius,
    center: [x, y],
  })

  group.addChild(circle)
}

function onMouseDrag(event) {
  removePromptText() // Remove the prompt text when drawing starts

  const circleRadius = event.delta.length / 2

  const circle = new Path.Circle({
    center: event.middlePoint,
    radius: circleRadius,
    fillColor: {
      gradient: {
        stops: ["white", "black", "grey", "black"],
        radial: true,
      },
      origin: event.middlePoint,
      destination: [event.middlePoint.x, event.middlePoint.y + circleRadius],
    },
  })

  group.addChild(circle)
}

// Animation function to update the gradient origins and destinations
function animateGradient(event) {
  const time = event.time * 2 // Speed of the animation

  group.children.forEach((path, index) => {
    const bounds = path.bounds

    // Calculate new destination point for the gradient
    const maxRadius = bounds.width / 2
    const newRadius = ((Math.sin(time + index) + 1) / 2) * maxRadius

    // Update the fillColor with new gradient points
    path.fillColor = {
      gradient: path.fillColor.gradient,
      origin: bounds.center,
      destination: [bounds.center.x, bounds.center.y - newRadius],
    }
  })
}

// Attach the animation function to the onFrame event
view.onFrame = animateGradient

// We use a library called `tweakpane` to build a user interface.
const options = { amount: 0 } // Set default amount to 0

const pane = new Pane()

// Add a button to manually update the effect, so we don't have to reload the browser.
const button = pane.addButton({ title: "Update" })
button.on("click", () => {
  location.reload() // Reload the page
})

// Export
pane
  .addButton({
    title: "Export",
  })
  .on("click", function () {
    const svg = project.exportSVG({ asString: true })
    downloadSVGFile("circle gradient mouse click", svg)
  })

function downloadSVGFile(fileName, content) {
  const a = document.createElement("a")
  const blob = new Blob([content], { type: "image/svg+xml" })
  a.href = URL.createObjectURL(blob)
  a.download = fileName + ".svg"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

pane.on("change", function () {
  // If we have already imported something, we will recolor it every time we
  // change the color in tweakpane.
  if (importedSVG) {
    importedSVG.fillColor = params.color
  }
})
