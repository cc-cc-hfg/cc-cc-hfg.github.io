//circle gradient scale
const group = new Group()

// Function to create circles based on the specified amount
function createCircles(amount) {
  group.removeChildren() // Clear existing circles

  const canvasWidth = view.size.width
  const canvasHeight = view.size.height
  const circleRadius = 20 // Adjust circle size as needed
  const circleSpacing = circleRadius * 2.5 // Spacing between circles

  // Calculate the maximum number of circles that can fit within the canvas
  const maxColumns = Math.floor(canvasWidth / circleSpacing)
  const maxRows = Math.floor(canvasHeight / circleSpacing)

  // Adjust the amount to ensure there are at least 3 circles
  const minCircles = 0
  const maxCircles = maxColumns * maxRows
  amount = Math.max(minCircles, Math.min(amount, maxCircles))

  // Create circles based on the adjusted amount
  let count = 0
  for (let i = 0; i < maxColumns && count < amount; i++) {
    for (let j = 0; j < maxRows && count < amount; j++) {
      const x = (i + 0.5) * circleSpacing
      const y = (j + 0.5) * circleSpacing

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
      count++
    }
  }
}

// Function to update the circles based on the amount
function updateCircles(amount) {
  createCircles(amount)
}

// We use a library called `tweakpane` to build a user interface.
const options = { amount: 0 } // Set default amount to 3

const pane = new Pane()
// Add an input for the `amount` option.
pane.addBinding(options, "amount", { min: 0, max: 1000 }) // Adjust max value as needed
// Each time something changes in the user interface, we want to apply the effect again. We do this in the `update()` function.
pane.on("change", () => {
  updateCircles(options.amount)
})
// Also add a button to manually update the effect, so we don't have to reload the browser.
const button = pane.addButton({ title: "Update" })
button.on("click", () => {
  updateCircles(options.amount)
})

// Run the update function once, so the screen isn't blank in the beginning.
updateCircles(options.amount)

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

// Export
pane
  .addButton({
    title: "Export",
  })
  .on("click", function () {
    const svg = project.exportSVG({ asString: true })
    downloadSVGFile("character_shuffle", svg)
  })

// pane.on("change", function () {
//   // If we have already imported something, we will recolor it every time we
//   // change the color in tweakpane.
//   if (importedSVG) {
//     importedSVG.fillColor = params.color
//   }
// })
