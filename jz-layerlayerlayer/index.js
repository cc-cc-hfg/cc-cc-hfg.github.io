import { Pane } from "/assets/tweakpane.js"
import {
  applyPathEffect,
  downloadSVGFile,
  randomMinMax,
} from "/assets/utils.js"

paper.install(window)
paper.setup(document.querySelector("canvas"))

// The paths we want to work with.
const group = new Group([
  new Path.Star({
    points: 4,
    radius: 140,

    radius1: 30,
    radius2: 100,

    strokeWidth: 1,
    strokeJoin: "round",

    center: [300, 200],
  }),
  new Path.Star({
    points: 4,
    radius1: 140,

    radius2: 30,
    strokeWidth: 1,
    strokeJoin: "round",
    center: [500, 400],
  }),
  new Path.Star({
    points: 4,
    radius1: 300,

    radius2: 130,

    strokeWidth: 1,
    strokeJoin: "round",
    center: [200, 400],
  }),
])

// We remove the group to make it invisible. We only want to see the random
// result, not the orgiginal paths.
group.remove()

// The effect function. It expects a path and some options, like `amount` in
// this case.

function randomize(path, { amount }) {
  for (const segment of path.segments) {
    segment.point.x += randomMinMax(-amount, amount)
  }

  path.fillColor = {
    gradient: {
      stops: [
        ["	 #e6ffe6", 0.04],
        ["#99ff99", 0.2],
        ["white", 1],
      ],
      radial: true,
    },
    origin: path.position,
    destination: path.bounds.rightCenter,
  }

  path.smooth({ type: "continuous" })

  path.blendMode = "difference"

  return path
}

// We use a library called `tweakpane` to build a user interface.
const params = { amount: 5, color: "rgb(255, 0,0)" }

const pane = new Pane()
// Add an input for the `amount` option.
pane.addBinding(params, "amount", { min: 0, max: 200 })

// Each time, something changes in the user interface we want to apply the
// effect again. We do this in the `update()` function.
pane.on("change", update)
// Also add a button to manually update the effect, so we don't have to reload
// the browser.
const button = pane.addButton({ title: "Update" })
button.on("click", update)

// Here we will store our imported SVG.
let importedSVG

pane.addBinding(params, "color")

// Export
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

let result
function update() {
  // Cleanup the canvas by removing anything we might have drawn previously.
  //if (result) result.remove()

  // Apply the `randomize` effect to the whole group. But because we wan't to
  // keep the original group, we clone it first.
  const clone = group.clone()
  result = applyPathEffect(clone, randomize, params)
  // Because the original group isn't visible (we removed it) the result is also
  // invisible, so we have to insert it.
  project.activeLayer.addChild(result)
}

// Run the update function once, so the the screen isn't blank in the beginning.
update()
