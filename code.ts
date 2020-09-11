// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

let nRows: number;
let nColumns: number;
let paddingSize: number;
let baseWidth: number;
let distanceResize = false;
const lines: SceneNode[] = [];

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-grid') {
    // Utiliza uma linha específica como "objetivo" para fins de testes
    // Pode mudar esses valores aqui pra escolhe qual X e Y da matriz vai ser o ponto "objetivo"


    // Rows
    // Columns
    // Padding
    // Color
    // Stroke
    // Randomizer
    // Width base size

    // Inflection Point
    // Force Deviation
    // Width Contraction
    createGrid(msg);
    rotateLines([getRandomPoint()]);
  }

  if (msg.type === 'rotate-lines') {
    let randomTests = Math.floor(Math.random()*4);
    if (randomTests == 0) {
      rotateLines([getRandomPoint()]);
    }
    else if (randomTests == 1) {
      rotateLines([getRandomPoint(), getRandomPoint(), getRandomPoint(), getRandomPoint()]);
    }
    else if (randomTests > 1) {
      rotateLines([getRandomPoint(), getRandomPoint()]);      
    }
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

function pointsDistance(x1, x2, y1, y2) {
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function createGrid(msg) {
  nRows = msg.rows;
  nColumns = msg.columns;
  paddingSize = msg.padding; 
  baseWidth = msg.widthSize;

  //const lines: SceneNode[] = [];
  //let elements = msg.count * msg.count;
  let elements = nRows * nColumns;
  // Max diagonal
  let maxDistance = nRows > nColumns ? paddingSize*nRows*Math.SQRT2 : paddingSize*nColumns*Math.SQRT2;
  //let maxDistance = paddingSize*msg.count*Math.SQRT2;

  // Create and rotate the lines in the array
  for (let i = 0; i < nRows; i++) {
    for (let j = 0; j < nColumns; j++){
      // Create a line at the center of the padding
      const newLine = figma.createLine();
      let centerPaddingOffset = paddingSize - baseWidth;
      newLine.resize(baseWidth, 0);
      newLine.x = j*paddingSize + centerPaddingOffset;
      newLine.y = i*paddingSize + paddingSize/2;
      // Add line to document and to array
      figma.currentPage.appendChild(newLine);
      lines.push(newLine);
    }
  }
  figma.currentPage.selection = lines;
  figma.viewport.scrollAndZoomIntoView(lines);
}

function rotateLines(targetPoints) {
  for (let i = 0; i < lines.length; i++) {
    // Reset line rotation, width and position
    lines[i].rotation = 0;
    lines[i].resize(baseWidth, 0);
    let centerPaddingOffset = paddingSize - baseWidth;
    lines[i].x = (i%nColumns)*paddingSize + centerPaddingOffset;
    lines[i].y = (Math.floor(i/nColumns))*paddingSize + paddingSize/2;

    // Select target point/points
    let inflectionPoints = selectInflectionPoints(i, targetPoints);

    // Deal with line that is a target point
    if (inflectionPoints[0] == -1) {
      lines[i].resize(0.01, 0);
      lines[i].x = lines[i].x + baseWidth/2;
    }
    // Deal with the other lines
    else {
      let targetPosX = inflectionPoints[1][2];
      let targetPosY = inflectionPoints[1][3];
      let hypotenuse = pointsDistance(lines[i].x, targetPosX, lines[i].y, targetPosY);
      let targetPosX2;
      let targetPosY2;
      let hypotenuse2;

      // Calculate if there are two points affecting the line
      if (inflectionPoints[0] == 2) {
        targetPosX2 = inflectionPoints[2][2];
        targetPosY2 = inflectionPoints[2][3];
        hypotenuse2 = pointsDistance(lines[i].x, targetPosX2, lines[i].y, targetPosY2);
      }

      if (distanceResize == true) {
        // Resize based on the distance
        let widthResize = (paddingSize/hypotenuse) < 1 ? 3*(paddingSize/hypotenuse) : 1;
        if (widthResize > 1) {
          widthResize = 1;
        }
        let newWidth = widthResize*lines[i].width;
        lines[i].resize(newWidth, 0);
        // Fix position based on the resize
        lines[i].x = lines[i].x + (baseWidth - newWidth)/2;
      }

      // Rotation reference: https://spectrum.chat/figma/extensions-and-api/relative-transform-point-of-rotation~7aa16373-9709-49b8-9145-5f3830ddfe32
      // Figure out where the current line is relative to its parent
      let locationRelativeToParentX = lines[i].x;
      let locationRelativeToParentY = lines[i].y;
  
      // Get the center of the rotation-point based on the line size
      let x = lines[i].width/2;
      let y = 0;
      
      // oc/hypotenuse = opposite cathetus / hypotenuse = sin(angle)
      // ac/hypotenuse = adjacent cathetus / hypotenuse = cos(angle)
      let oc = targetPosY - locationRelativeToParentY;
      let ac = targetPosX - locationRelativeToParentX;
      // Get rotation angle based on the distance to the target
      let rotationAngle = Math.atan(oc/ac);
      if (ac <= 0) {
        rotationAngle = rotationAngle - Math.PI;
      }
      
      // Balance the rotation angle based on the distance to the points
      if (inflectionPoints[0] == 2) {
        let oc2 = targetPosY2 - locationRelativeToParentY;
        let ac2 = targetPosX2 - locationRelativeToParentX;
        let rotationAngle2 = Math.atan(oc2/ac2);
        if (ac2 <= 0) {
          rotationAngle2 = rotationAngle2 - Math.PI;
        }
        let hyp1hyp2 = hypotenuse2+hypotenuse;
        rotationAngle = (1 - (hypotenuse/hyp1hyp2)) * rotationAngle + (1 - (hypotenuse2/hyp1hyp2)) * rotationAngle2;
      }
      
      // Force Deviation reflected by Rotation "error"
      //rotationAngle = rotationAngle + 30 * Math.PI / 180;
      
      // Transforms to fix line position because the rotation is done around line's starting point, and not its center point
      let myTransformX = x - x * Math.cos(rotationAngle) + y * Math.sin(rotationAngle);
      let myTransformY = y - x * Math.sin(rotationAngle) - y * Math.cos(rotationAngle);

      // This is the final Transform matrix that'll do the translation + rotation
      // The final transform is [[cos(angle), sin(angle), translationX][-sin(angle), cos(angle), translationY]]
      // The angle depicted in the last comment is the rotation angle
      let myRotationTransform = [[Math.cos(rotationAngle), -Math.sin(rotationAngle), myTransformX],[Math.sin(rotationAngle), Math.cos(rotationAngle), myTransformY]] as Transform;
      lines[i].relativeTransform = myRotationTransform;
      
      // Move the line back to where it was initially relative to it's parent element
      lines[i].x = lines[i].x + locationRelativeToParentX;
      lines[i].y = lines[i].y + locationRelativeToParentY;  
      
    }
  }
}

// Return random inflection point
function getRandomPoint() {
  let lineRefX = Math.floor(Math.random() * nRows);
  let lineRefY = Math.floor(Math.random() * nColumns);
  return [lineRefX, lineRefY, lineRefY*paddingSize, lineRefX*paddingSize];
}

function selectInflectionPoints(lineIndex, points) {
  // 0 inflection points
  if (points.length < 1) {
    return [0, null];
  }
  // Only one inflection point
  else if (points.length == 1) {
    let targetInArray = points[0][0] * nColumns + points[0][1];
    // If current line is an inflection point
    if (targetInArray == lineIndex) {
      return [-1, null];
    }
    return [1, points[0]];
  }
  // At least two inflection points
  else {
    let pointOne: number; 
    let pointTwo: number;
    let distances: number[] = [];
    let smallestDistance = paddingSize*paddingSize;
    let smallestIndex = -1;
    for (let i = 0; i < points.length; i++) {
      let targetInArray = points[i][0] * nColumns + points[i][1];
      // If current line is an inflection point
      if (targetInArray == lineIndex) {
        return [-1, null];
      }
      // Find the closest inflection point to the line
      else {
        let distance = pointsDistance(lines[lineIndex].x, points[i][2], lines[lineIndex].y, points[i][3]);
        distances.push(distance);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          smallestIndex = i;
        }
      }
    }
    pointOne = smallestIndex;
    smallestIndex = -1;
    smallestDistance = paddingSize*paddingSize;
    // Find the second closest inflection point to the line
    for (let j = 0; j < distances.length; j++) {
      if (j != pointOne) {
        if (distances[j] < smallestDistance) {
          smallestDistance = distances[j];
          smallestIndex = j;
        }
      }
    }
    pointTwo = smallestIndex;
    return [2, points[pointOne], points[pointTwo]];
  }
}