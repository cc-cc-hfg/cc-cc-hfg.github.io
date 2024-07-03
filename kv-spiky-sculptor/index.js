//SPIKY SCULPTOR

const RADIUS = 100;

const PARAMS = {
  file: "",
  message: "Hello",
  wordOffset: { x: 0, y: 0 },
  wordRotation: 0,
  wordSize: 50,
  shapeOffset: { x: 0, y: 0 },
  shapeSize: 100,
  shapeFill: true,
};

const getRandomColor = () => {
  const colors = ["#4b51fa"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return randomColor;
};

const background = new Path.Rectangle({
  width: view.bounds.width,
  height: view.bounds.height,
  center: [0, 0],
  fillColor: "#daff54",
});

const blob = new Path.RegularPolygon({
  center: view.center,
  sides: 50,
  radius: RADIUS,
  fillColor: "black",
});

blob.smooth();

const originalBlob = blob.clone({ insert: false });

tool.minDistance = 150;
let isMoving = false;
let retractTween = null;
let isMouseDown = false;
let hasRetracted = false;
let retractTimeoutQueued = false;
const MIN_DISTANCE_TO_CONNECT = 100;

let spread = 0;
const isEven = (number) => {
  if (number % 2 === 0) {
    return true;
  } else false;
};

let pathArr = [];
let connectedPaths = [];
let connectedBlobSegments = [];

const processMove = (blob, event, pathArr) => {
  const mousePos = event.point;

  //Get the index that is nearest to the current mouse position
  const getNearestIndex = () => {
    let nearestDistance = Infinity;
    let nearestSegmentIndex = 0;
    blob.segments.forEach((segment, index) => {
      const distance = segment.point.getDistance(event.point);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestSegmentIndex = index;
      }
    });

    return nearestSegmentIndex;
  };

  const nearestSegmentIndex = getNearestIndex();
  // console.log("NEAREST SEGMENT", nearestSegmentIndex);

  //We clone the blob and move it to the mouse position so we can use its points for tweening
  originalBlob.position = event.point;

  //Factor by which blob points should spread when the blob moves
  const BLOB_SPREAD = 100;

  const getSpreadPoints = () => {
    const spreadPoints = {};
    blob.segments.forEach((segment, index) => {
      if (isEven(index) && index !== nearestSegmentIndex) {
        const spreadVector = segment.point.subtract(blob.position);
        const direction = spreadVector.normalize();
        const distance = BLOB_SPREAD;
        const scaledSpreadVector = direction.multiply(distance);

        spreadPoints[`segments[${index}].point`] =
          segment.point.add(scaledSpreadVector);
      } else if (index === nearestSegmentIndex) {
        spreadPoints[`segments[${index}].point`] = mousePos;
      }
    });

    return spreadPoints;
  };

  //Duration of the spreading animation
  const SPREAD_DURATION = 200;
  if (!isMouseDown) {
    const spreadBlob = blob.tweenTo(getSpreadPoints(), {
      easing: "easeInQuad",
      duration: SPREAD_DURATION,
    });
  }

  const getMoveToPoints = () => {
    const moveToPoints = {};
    blob.segments.forEach((segment, index) => {
      moveToPoints[`segments[${index}].point`] =
        originalBlob.segments[index].point;
    });

    return moveToPoints;
  };

  const moveConnectedPaths = () => {
    pathArr.forEach((path) => {
      connectedPaths.forEach((conncetedPath) => {
        if (conncetedPath.id === path.id) {
          const MOVE_DURATION = 200;

          setTimeout(() => {
            const movePath = path.tweenTo(conncetedPath.moveToPoints, {
              easing: "easeInQuad",
              duration: MOVE_DURATION,
            });
          }, 0);
        }
      });
    });
  };

  //Duration of the moving animation IMPORTANT: Must be longer than the spreading animation
  const MOVE_DURATION = 200;

  if (isMouseDown) {
    const moveBlobTween = blob.tweenTo(
      {
        position: mousePos,
      },
      {
        easing: "easeInQuad",
        duration: MOVE_DURATION,
      }
    );

    moveBlobTween.then(() => {
      moveConnectedPaths();
      isMoving = false;
    });
  } else {
    const moveBlob = blob.tweenTo(getMoveToPoints(), {
      easing: "easeInQuad",
      duration: MOVE_DURATION,
    });

    moveBlob.then(() => {
      isMoving = false;
    });
  }
};

const spreadBlob = (blob, spread, pathArr) => {
  const BLOB_SPREAD = spread;
  const MAX_SPREAD_SIZE = RADIUS + 300;
  let isMaxSpread = false;

  blob.segments.forEach((segment, index) => {
    if (isEven(index)) {
      const spreadVector = segment.point.subtract(blob.position);
      const direction = spreadVector.normalize();
      const distance = BLOB_SPREAD;
      const scaledSpreadVector = direction.multiply(distance);

      const roundedLength = Math.round(spreadVector.length);

      if (roundedLength <= MAX_SPREAD_SIZE) {
        segment.point = segment.point.add(scaledSpreadVector);
        //We apply the connect the points on the max spread
        if (roundedLength === MAX_SPREAD_SIZE && !isMaxSpread) {
          isMaxSpread = true;
          applyConnectPoints(blob, pathArr);
        }
      }
    }
  });
};

const connectPoints = (blob, path) => {
  const moveToPoints = {};

  path.segments.forEach((pathSegment, pathSegmentIndex) => {
    let nearestDistance = Infinity;
    let nearestBlobSegmentIndex = null;

    blob.segments.forEach((blobSegment, blobSegmentIndex) => {
      if (isEven(blobSegmentIndex)) {
        const distance = pathSegment.point.getDistance(blobSegment.point);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestBlobSegmentIndex = blobSegmentIndex;
        }
      }
    });

    if (nearestDistance < MIN_DISTANCE_TO_CONNECT && nearestBlobSegmentIndex) {
      moveToPoints[`segments[${pathSegmentIndex}].point`] =
        blob.segments[nearestBlobSegmentIndex].point;
      connectedBlobSegments.push(nearestBlobSegmentIndex);
    }
    // if (nearestDistance < MIN_DISTANCE && nearestBlobSegmentIndex) {
    //   pathSegment.point = blob.segments[nearestBlobSegmentIndex].point;
    // }
  });

  if (Object.keys(moveToPoints).length !== 0) {
    connectedPaths.push({ id: path.id, moveToPoints: moveToPoints });
  }

  // console.log("MOVE TO POINTS", connectedPaths);
  // console.log(connectedPaths);

  const MOVE_DURATION = 400;

  //idk solves the visual glitch happening for whatever reason
  setTimeout(() => {
    const movePath = path.tweenTo(moveToPoints, {
      easing: "easeInQuad",
      duration: MOVE_DURATION,
    });
  }, 0);
};

const retractPoints = (blob) => {
  const retractPoints = {};
  blob.segments.forEach((segment, index) => {
    if (!connectedBlobSegments.includes(index)) {
      retractPoints[`segments[${index}].point`] =
        originalBlob.segments[index].point;
    }
  });
  const RETRACT_DURATION = 1000;

  retractTween = blob.tweenTo(retractPoints, {
    easing: "easeOutQuad",
    duration: RETRACT_DURATION,
  });
};

const applyConnectPoints = (blob, pathArr) => {
  pathArr.forEach((path) => {
    connectPoints(blob, path);
  });
};

const createLetter = (letter) => {
  const alphabet = {
    A: [20, 15, 10, 6, 2, 8, 14, 16, 17, 18, 19, 24],
    B: [0, 5, 10, 15, 20, 1, 2, 3, 9, 13, 12, 11, 21, 22, 23, 19],
    C: [1, 2, 3, 4, 5, 10, 15, 21, 22, 23, 24],
    D: [0, 1, 2, 3, 5, 10, 15, 20, 21, 22, 23, 9, 14, 19],
    E: [0, 1, 2, 3, 4, 5, 10, 15, 20, 21, 22, 23, 24, 11, 12, 13, 14],
    F: [0, 1, 2, 3, 4, 5, 10, 15, 20, 11, 12, 13, 14],
    G: [0, 1, 2, 3, 4, 5, 10, 15, 20, 21, 22, 23, 24, 19, 14, 13, 12],
    H: [0, 5, 10, 15, 20, 11, 12, 13, 14, 4, 9, 19, 24],
    I: [2, 7, 12, 17, 22, 0, 1, 3, 4, 20, 21, 23, 24],
    J: [15, 21, 22, 23, 19, 14, 9, 4],
    K: [0, 5, 10, 15, 20, 11, 12, 8, 4, 18, 24],
    L: [0, 5, 10, 15, 20, 21, 22, 23, 24],
    M: [0, 5, 10, 15, 20, 4, 9, 14, 19, 24, 6, 12, 8],
    N: [0, 5, 10, 15, 20, 4, 9, 14, 19, 24, 6, 12, 18],
    O: [5, 10, 15, 21, 22, 23, 19, 14, 9, 3, 2, 1],
    P: [0, 5, 10, 15, 20, 1, 2, 3, 9, 13, 12, 11],
    Q: [5, 10, 15, 21, 22, 23, 19, 14, 9, 3, 2, 1, 18],
    R: [0, 5, 10, 15, 20, 1, 2, 3, 9, 13, 12, 11, 18, 24],
    S: [4, 3, 2, 1, 5, 10, 11, 12, 13, 19, 23, 22, 21, 20],
    T: [2, 7, 12, 17, 22, 0, 1, 3, 4],
    U: [0, 5, 10, 15, 21, 22, 23, 19, 14, 9, 4],
    V: [0, 5, 10, 22, 14, 9, 4, 16, 18],
    W: [0, 5, 10, 15, 20, 4, 9, 14, 19, 24, 16, 12, 18],
    X: [0, 6, 12, 18, 24, 4, 8, 16, 20],
    Y: [0, 6, 12, 8, 4, 17, 22],
    Z: [0, 1, 2, 3, 4, 8, 12, 16, 20, 21, 22, 23, 24],
  };

  const GRID_SIZE = 5;
  const CELL_SIZE = PARAMS.wordSize;
  const PRIMARY_COLOR = "black";
  const SECONDARY_COLOR = "#4b51fa";

  let currentRow;
  let currentXOffset = 0;

  const fillArray = [];
  const shadowArray = [];

  const randomNumber = Math.floor(Math.random() * 10) + 1;

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    let isNewRow = false;

    currentXOffset++;

    if (i % GRID_SIZE === 0) {
      currentXOffset = 0;
      isNewRow = true;
    }
    currentRow = Math.floor(i / GRID_SIZE);

    const position = view.center.add([
      currentXOffset * CELL_SIZE,
      currentRow * CELL_SIZE,
    ]);

    // const rectangle = new Path.Rectangle({
    //   width: CELL_SIZE,
    //   height: CELL_SIZE,
    //   position: position,
    //   strokeWidth: 1,
    //   strokeColor: "red",
    //   insert: false,
    // });

    if (alphabet.hasOwnProperty(letter.toUpperCase())) {
      alphabet[letter.toUpperCase()].forEach((number) => {
        if (number === i) {
          const shape = new Path.Circle({
            radius: CELL_SIZE / 2,
            fillColor:
              i % randomNumber === 0 && i !== 0
                ? SECONDARY_COLOR
                : PRIMARY_COLOR,
            position: position,
            insert: false,
            strokeWidth: 10,
            fillColor:
              i % randomNumber === 0 && i !== 0
                ? SECONDARY_COLOR
                : PRIMARY_COLOR,
          });

          //   const shape = new Path.RegularPolygon({
          //     position: position,
          //     sides: 8,
          //     radius: CELL_SIZE / 1.5,
          //     fillColor: "white",
          //     rotation: 0,
          //     strokeWidth: 5,
          //     strokeColor: "black",
          //     insert: false,
          //   });

          // const shadow = shape.clone();
          // shadow.fillColor = "none";
          // shadow.strokeColor = "white";
          // shadow.strokeWidth = 3;

          //   shadow.position = shadow.position.add([7, 7]);
          // shadow.position = shadow.position.add([0, 10]);
          // shadow.bounds.height = view.bounds.height / 2;

          // shadowArray.push(shadow);
          fillArray.push(shape);
        }
      });
    } else return null;
  }

  const letterShape = new Group(fillArray);
  // const shadowShape = new Group(shadowArray);

  // const wholeShape = new Group([shadowShape, letterShape]);

  // wholeShape.insert = false;

  //   console.log(letterShape);

  return letterShape;
};

const write = (word) => {
  const letterArray = [];

  word.split("").forEach((letter) => {
    letterArray.push(createLetter(letter));
  });

  const GAP = 20;

  letterArray.forEach((letter, index) => {
    if (letter) {
      const xOffset = letter.bounds.width + GAP;
      letter.position = letter.position.add([
        index * xOffset,
        index % 2 === 0 ? 0 : 0,
      ]);
    }
  });

  const wordGroup = new Group(letterArray);

  const offsetX = PARAMS.wordOffset.x;
  const offsetY = PARAMS.wordOffset.y;

  wordGroup.position = view.center.add(new Point(offsetX, offsetY));

  wordGroup.rotate(PARAMS.wordRotation);

  return wordGroup;
};

function onMouseMove(event) {
  if (!isMoving) {
    isMoving = true;
    if (retractTween) {
      retractTween.stop();
    }
    processMove(blob, event, pathArr);
  }
}

function onMouseDown(event) {
  isMouseDown = true;
  if (retractTween) {
    retractTween.stop();
  }
}

function onMouseUp(event) {
  isMouseDown = false;
  spread = 0;
  framesPassed = 0;
  connectedPaths = [];
  connectedBlobSegments = [];
  hasRetracted = false;
  retractPoints(blob);
}

function onFrame() {
  if (isMouseDown && !hasRetracted) {
    spread++;
    spreadBlob(blob, spread, pathArr);
    if (!retractTimeoutQueued && connectedPaths.length > 0) {
      retractTimeoutQueued = true;
      setTimeout(() => {
        hasRetracted = true;
        retractTimeoutQueued = false;
        retractPoints(blob);
      }, 300);
    }

    // framesPassed++;
    // if (framesPassed === 60) {
    //   framesPassed = 0;
    // }
  }
}

let wordCount = 0;

const writeMessage = (message) => {
  const word = write(message);
  const paths = word.getItems({ class: Path });
  paths.forEach((path) => {
    pathArr.push(path);
  });
  wordCount++;
};

const generateRandomShape = () => {
  const MAX_SIDES = 10;
  const MIN_SIDES = 3;

  const offsetX = PARAMS.shapeOffset.x;
  const offsetY = PARAMS.shapeOffset.y;

  const randomPosition = view.center.add(new Point(offsetX, offsetY));

  const randomSides =
    Math.floor(Math.random() * (MAX_SIDES - MIN_SIDES + 1)) + MIN_SIDES;
  const MAX_RADIUS = 200;
  const MIN_RADIUS = 50;
  const randomRadius = Math.random() * MAX_RADIUS + MIN_RADIUS;

  const randomShape = new Path.RegularPolygon({
    center: randomPosition,
    sides: randomSides,
    radius: PARAMS.shapeSize,
    fillColor: PARAMS.shapeFill ? getRandomColor() : "rgba(0,0,0,0)",
    strokeWidth: 10,
    strokeColor: getRandomColor(),
  });

  randomShape.segments.forEach((segment) => {
    const angle = segment.location.angle;
    const randomDistance = randomRadius * (0.8 + Math.random() * 0.4);
    segment.point = segment.point.add(
      new Point({
        length: randomDistance,
        angle: angle + (Math.random() - 0.5) * 60,
      })
    );
  });

  // Randomly rotate the entire shape
  randomShape.rotate(Math.random() * 360);

  randomShape.smooth();

  pathArr.push(randomShape);
};

let shapeCount = 0;

const pane = new Pane();

const messageSettings = pane.addFolder({
  title: "Message",
});

messageSettings.addBinding(PARAMS, "message");

messageSettings.addBinding(PARAMS, "wordOffset", {
  min: -view.bounds.height / 2,
  max: view.bounds.height / 2,
  step: 10,
  picker: "inline",
  expanded: true,
});

messageSettings.addBinding(PARAMS, "wordSize", {
  view: "slider",
  min: 10,
  max: 100,
  value: 50,
});

messageSettings.addBinding(PARAMS, "wordRotation", {
  view: "slider",
  min: 0,
  max: 360,
  value: 0,
});

messageSettings.addButton({ title: "Add message" }).on("click", () => {
  if (wordCount < 3) {
    writeMessage(PARAMS.message);
    blob.bringToFront();
  } else {
    alert("Too many words!!");
  }
});

const shapeSettings = pane.addFolder({
  title: "Shape",
});

shapeSettings.addBinding(PARAMS, "shapeOffset", {
  min: -view.bounds.height / 2,
  max: view.bounds.height / 2,
  step: 10,
  picker: "inline",
  expanded: true,
});

shapeSettings.addBinding(PARAMS, "shapeSize", {
  view: "slider",
  min: 20,
  max: 300,
  value: 0,
});

shapeSettings.addBinding(PARAMS, "shapeFill");

shapeSettings.addButton({ title: "Add shape" }).on("click", () => {
  if (shapeCount < 10) {
    shapeCount++;
    generateRandomShape();
    blob.bringToFront();
  } else {
    alert("Too many shapes!!");
  }
});

pane.addButton({ title: "Clear" }).on("click", () => {
  pathArr.forEach((path) => {
    path.remove();
  });
  wordCount = 0;
  shapeCount = 0;
  pathArr = [];
});

pane
  .addButton({
    title: "Export",
  })
  .on("click", function () {
    const svg = project.exportSVG({ asString: true });
    downloadSVGFile("sculpture", svg);
  });
