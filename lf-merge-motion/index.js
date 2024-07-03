// Merge Motion

var paths = []
var currentText = null
var animationActive = true
var mergedPairs = new Set()

var options = {
  strokeWidth: 2,
  animationSpeed: 0.1,
  mergeChance: 0.05,

  fontSize: 40,
  colorCount: 20, // New option for color count
}

var colors = [
  "#6495ED",
  "#00BFFF",
  "#87CEEB",
  "#ADD8E6",
  "#B0E0E6",
  "#5F9EA0",
  "#4682B4",
  "#63B8FF",
  "#00688B",
  "#48D1CC",
  "#FFC0CB",
  "#FFB6C1",
  "#FF69B4",
  "#FF1493",
  "#DB7093",
  "#C71585",
  "#D8BFD8",
  "#DDA0DD",
  "#EE82EE",
  "#DA70D6",
]

function getRandomColor() {
  return colors[Math.floor(Math.random() * options.colorCount)]
}

function onMouseDown(event) {
  var strokeColor = getRandomColor()
  var strokeWidth = options.strokeWidth
  var path = new Path({
    strokeColor: strokeColor,
    strokeWidth: strokeWidth,
  })
  path.add(event.point)
  path.velocity = new Point(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  )
  paths.push(path)
}

function onMouseDrag(event) {
  var path = paths[paths.length - 1]
  if (path instanceof Path) {
    path.add(event.point)
  } else if (path instanceof CompoundPath) {
    var newSegment = new Segment(event.point)
    path.children[path.children.length - 1].add(newSegment)
  }
}

function onKeyDown(event) {
  if (!currentText) {
    currentText = new PointText({
      point: new Point(
        Math.random() * view.size.width,
        Math.random() * view.size.height
      ),
      content: "",
      fillColor: getRandomColor(),
      fontSize: options.fontSize,
      fontFamily: "Arial",
    })
    currentText.id = Date.now() + Math.random()
  }

  if (event.key === "enter") {
    if (currentText.content.length > 0) {
      currentText.velocity = new Point(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )
      paths.push(currentText)
      currentText = null
    }
  } else if (event.key === "backspace") {
    currentText.content = currentText.content.slice(0, -1)
  } else if (event.key === "space") {
    currentText.content += " "
  } else if (event.key.length === 1) {
    currentText.content += event.key
  }
}

function onMouseUp(event) {
  var path = paths[paths.length - 1]
  if (path instanceof Path) {
    path.simplify()
  }
}

function wrapAroundScreen(item) {
  if (item.bounds.left > view.size.width) {
    item.position.x = item.bounds.width / 2
  } else if (item.bounds.right < 0) {
    item.position.x = view.size.width - item.bounds.width / 2
  }

  if (item.bounds.top > view.size.height) {
    item.position.y = item.bounds.height / 2
  } else if (item.bounds.bottom < 0) {
    item.position.y = view.size.height - item.bounds.height / 2
  }
}

function animateItems() {
  if (!animationActive) return
  for (var i = paths.length - 1; i >= 0; i--) {
    var item = paths[i]
    if (!item.velocity) {
      console.warn("Item without velocity:", item)
      item.velocity = new Point(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      )
    }

    item.position = item.position.add(
      item.velocity.multiply(options.animationSpeed)
    )

    if (item instanceof PointText) {
      wrapAroundScreen(item)
    } else {
      if (item.bounds.left < 0 || item.bounds.right > view.size.width) {
        item.velocity.x *= -1
      }
      if (item.bounds.top < 0 || item.bounds.bottom > view.size.height) {
        item.velocity.y *= -1
      }
    }

    for (var j = i - 1; j >= 0; j--) {
      var otherItem = paths[j]
      if (
        (item instanceof Path || item instanceof CompoundPath) &&
        (otherItem instanceof Path || otherItem instanceof CompoundPath) &&
        item.intersects(otherItem)
      ) {
        handleCollision(item, otherItem, i, j)
      } else if (item instanceof PointText && otherItem instanceof PointText) {
        if (item.bounds.intersects(otherItem.bounds)) {
          handleTextCollision(item, otherItem)
        }
      }
    }
  }
}

function handleCollision(item, otherItem, i, j) {
  const shouldMerge = Math.random() < options.mergeChance
  if (shouldMerge) {
    mergeItems(item, otherItem, i, j)
  } else {
    changeColorsOnCollision(item, otherItem)
    item.velocity = item.velocity.multiply(-1)
    otherItem.velocity = otherItem.velocity.multiply(-1)
  }
}

function mergeItems(item, otherItem, i, j) {
  let mergedItem
  if (item instanceof PointText && otherItem instanceof PointText) {
    mergedItem = new PointText({
      point: item.point,
      content: item.content + " " + otherItem.content,
      fillColor: getRandomColor(),
      fontSize: options.fontSize,
      fontFamily: "Arial",
    })
  } else {
    mergedItem = new CompoundPath()
    mergedItem.addChild(item)
    mergedItem.addChild(otherItem)
    mergedItem.strokeColor = getRandomColor()
    mergedItem.fillColor = getRandomColor()
  }
  mergedItem.velocity = item.velocity.add(otherItem.velocity).divide(2)
  paths.push(mergedItem)
  paths.splice(i, 1)
  paths.splice(j, 1)
}

function changeColorsOnCollision(item, otherItem) {
  if (item.fillColor) item.fillColor = getRandomColor()
  if (item.strokeColor) item.strokeColor = getRandomColor()
  if (otherItem.fillColor) otherItem.fillColor = getRandomColor()
  if (otherItem.strokeColor) otherItem.strokeColor = getRandomColor()
}

function handleTextCollision(text1, text2) {
  const pairId =
    Math.min(text1.id, text2.id) + "_" + Math.max(text1.id, text2.id)
  if (!mergedPairs.has(pairId)) {
    const shouldMerge = Math.random() < options.mergeChance
    if (shouldMerge) {
      text1.content += " " + text2.content
      text1.fillColor = getRandomColor()
      text2.content = ""
      text2.fillColor = getRandomColor()
      mergedPairs.add(pairId)
    }
  }
  let temp = text1.velocity
  text1.velocity = text2.velocity
  text2.velocity = temp
  text1.fillColor = getRandomColor()
  text2.fillColor = getRandomColor()
  let overlap = text1.bounds.intersect(text2.bounds)
  let moveVector = new Point(overlap.width / 2, overlap.height / 2)
  if (text1.position.x < text2.position.x) {
    text1.position = text1.position.subtract(moveVector)
    text2.position = text2.position.add(moveVector)
  } else {
    text1.position = text1.position.add(moveVector)
    text2.position = text2.position.subtract(moveVector)
  }
}

view.onFrame = function (event) {
  animateItems()
}

const pane = new Pane()
pane.registerPlugin(TweakpaneFileImportPlugin)

const noticeEl = document.createElement("div")
noticeEl.textContent =
  "Draw with the mouse. Type and press enter to send away your text."
noticeEl.style.cssText = `
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(41, 42, 46, 1);
  color: rgba(144, 145, 151, 1);
  padding: 5px 10px;
  border-radius: 5px;
  font-family: Helvetica, sans-serif;
  font-size: 13px;
`
document.body.appendChild(noticeEl)

pane.addBinding(options, "strokeWidth", { min: 1, max: 20 })
pane.addBinding(options, "animationSpeed", { min: 0, max: 10, step: 0.1 })
pane.addBinding(options, "mergeChance", { min: 0, max: 1, step: 0.01 })
pane.addBinding(options, "fontSize", { min: 10, max: 100, step: 1 })
pane.addBinding(options, "colorCount", { min: 1, max: colors.length, step: 1 }) // New binding for color count

pane.element.style.top = "0px"

pane.on("change", (ev) => {
  if (ev.presetKey === "fontSize") {
    paths.forEach((path) => {
      if (path instanceof PointText) {
        path.fontSize = options.fontSize
      }
    })
    if (currentText) {
      currentText.fontSize = options.fontSize
    }
  }
  if (ev.presetKey === "colorCount") {
    paths.forEach((path) => {
      if (path instanceof Path || path instanceof CompoundPath) {
        path.strokeColor = getRandomColor()
        if (path.fillColor) path.fillColor = getRandomColor()
      } else if (path instanceof PointText) {
        path.fillColor = getRandomColor()
      }
    })
  }
})

function checkAnimationStatus() {
  console.log("Animation active:", animationActive)
  console.log("Number of paths:", paths.length)
  paths.forEach((path, index) => {
    console.log(`Path ${index}:`, path.position, path.velocity)
  })
}

function exportAsSVG() {
  var exportProject = project.exportSVG({ asString: false })
  var background = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  )
  background.setAttribute("width", "100%")
  background.setAttribute("height", "100%")
  background.setAttribute("fill", "black")
  exportProject.insertBefore(background, exportProject.firstChild)
  var serializer = new XMLSerializer()
  var svgString = serializer.serializeToString(exportProject)
  var blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
  var link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "canvas_export.svg"
  link.click()
}

const exportButton = document.createElement("button")
exportButton.textContent = "Export as SVG"
exportButton.style.cssText = `
  position: absolute;
  top: 40px;
  left: 10px;
  background-color: rgba(41, 42, 46, 1);
  color: rgba(144, 145, 151, 1);
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-family: Helvetica, sans-serif;
  font-size: 13px;
  cursor: pointer;
`
exportButton.onclick = exportAsSVG
document.body.appendChild(exportButton)

const reloadButton = document.createElement("button")
reloadButton.textContent = "Reload Page"
reloadButton.style.cssText = `
  position: absolute;
  top: 70px;
  left: 10px;
  background-color: rgba(41, 42, 46, 1);
  color: rgba(144, 145, 151, 1);
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-family: Helvetica, sans-serif;
  font-size: 13px;
  cursor: pointer;
`
reloadButton.onclick = function () {
  location.reload()
}
document.body.appendChild(reloadButton)
