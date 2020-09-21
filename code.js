// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(550, 350); //resizing iframe in which the UI lies
let nRows;
let nColumns;
let paddingSize;
let baseWidth;
let distanceResize = false;
let strokeWeight;
const lines = [];
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'generate-grid') {
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
        clearLines();
        generateGrid(msg);
        //rotateLines([getRandomPoint()]);
    }
    if (msg.type === 'rotate-lines') {
        let randomTests = Math.floor(Math.random() * 4);
        //let randomTests = 1;
        if (randomTests == 0) {
            rotateLines([getRandomPoint()]);
        }
        else if (randomTests == 1) {
            rotateLines([getRandomPoint(), getRandomPoint(), getRandomPoint(), getRandomPoint()]);
        }
        else if (randomTests > 1) {
            rotateLines([getRandomPoint(), getRandomPoint()]);
        }
        else if (randomTests == -1) {
            rotateLines([[27, 7, 7 * paddingSize, 27 * paddingSize], [7, 20, 20 * paddingSize, 7 * paddingSize]]);
        }
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
function pointsDistance(x1, x2, y1, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
function generateGrid(msg) {
    nRows = msg.rows;
    nColumns = msg.columns;
    paddingSize = msg.padding + msg.cellSize;
    baseWidth = msg.cellSize;
    strokeWeight = msg.strokeWeight;
    //const lines: SceneNode[] = [];
    //let elements = msg.count * msg.count;
    let elements = nRows * nColumns;
    // Max diagonal
    let maxDistance = Math.sqrt((nRows * nRows) + (nColumns * nColumns));
    //let maxDistance = paddingSize*msg.count*Math.SQRT2;
    // Create the lines in the array
    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nColumns; j++) {
            // Create a line at the center of the padding
            const newLine = figma.createLine();
            let centerPaddingOffset = (paddingSize - baseWidth) / 2;
            newLine.resize(baseWidth, 0);
            newLine.x = j * paddingSize + centerPaddingOffset;
            newLine.y = i * paddingSize + paddingSize / 2;
            newLine.strokes = msg.paint;
            newLine.strokeWeight = strokeWeight;
            // Add line to document and to array
            figma.currentPage.appendChild(newLine);
            lines.push(newLine);
        }
    }
    figma.group(lines, figma.currentPage);
    figma.currentPage.selection = lines;
    figma.viewport.scrollAndZoomIntoView(lines);
}
function rotateLines(targetPoints) {
    let elementsRemoved = false;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].removed) {
            lines.splice(i, 1);
            elementsRemoved = true;
        }
        else {
            if (elementsRemoved == true) {
                continue;
            }
            else {
                // Reset line rotation, width and position
                lines[i].rotation = 0;
                lines[i].resize(baseWidth, 0);
                let centerPaddingOffset = (paddingSize - baseWidth) / 2;
                lines[i].x = (i % nColumns) * paddingSize + centerPaddingOffset;
                lines[i].y = (Math.floor(i / nColumns)) * paddingSize + paddingSize / 2;
                // Select target point/points
                let inflectionPoints = preprocessInflectionPoints(i, targetPoints);
                // Deal with line that is a target point
                if (inflectionPoints[0] == -1) {
                    lines[i].resize(0.01, 0);
                    lines[i].x = lines[i].x + baseWidth / 2;
                }
                // Deal with the other lines
                else {
                    let ocSum = 0;
                    let acSum = 0;
                    /*
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
                    */
                    // Rotation reference: https://spectrum.chat/figma/extensions-and-api/relative-transform-point-of-rotation~7aa16373-9709-49b8-9145-5f3830ddfe32
                    // and https://github.com/figma/plugin-samples/blob/master/circletext/code.ts
                    // Figure out where the current line is relative to its parent
                    let locationRelativeToParentX = lines[i].x;
                    let locationRelativeToParentY = lines[i].y;
                    // Get the center of the rotation-point based on the line size
                    let x = lines[i].width / 2;
                    let y = strokeWeight / 2;
                    let rotationAngle;
                    // If there's only one point affecting the Rotation
                    if (inflectionPoints[0] == 1) {
                        // Get its OC and AC then calculate its rotation angle
                        ocSum = ocSum + inflectionPoints[2][3] - locationRelativeToParentY;
                        acSum = acSum + inflectionPoints[2][2] - locationRelativeToParentX;
                        if (acSum == 0) {
                            rotationAngle = Math.PI / 2;
                        }
                        else {
                            rotationAngle = -Math.atan(ocSum / acSum);
                        }
                    }
                    // If there are two or more points affecting the rotation
                    else if (inflectionPoints[0] >= 2) {
                        let maxDistance = inflectionPoints[1];
                        for (let j = 2; j < inflectionPoints.length; j++) {
                            let pointAc = inflectionPoints[j][2] - locationRelativeToParentX;
                            let pointOc = inflectionPoints[j][3] - locationRelativeToParentY;
                            let hypotenuse = pointsDistance(lines[i].x, inflectionPoints[j][2], lines[i].y, inflectionPoints[j][3]);
                            // Point influence is inversely proportional to its distance to the line being rotated
                            ocSum = ocSum + pointOc / Math.pow(hypotenuse, 2);
                            acSum = acSum + pointAc / Math.pow(hypotenuse, 2);
                        }
                        if (acSum == 0) {
                            rotationAngle = Math.PI / 2;
                        }
                        else {
                            rotationAngle = -Math.atan(ocSum / acSum);
                        }
                    }
                    // Fix rotation angle based on it's resulting quadrant
                    if (acSum <= 0) {
                        if (ocSum <= 0) {
                            rotationAngle = Math.PI + rotationAngle;
                        }
                        else {
                            rotationAngle = rotationAngle - Math.PI;
                        }
                    }
                    // Force Deviation reflected by Rotation "error"
                    //rotationAngle = rotationAngle + 30 * Math.PI / 180;
                    // Transforms to fix line position because the rotation is done around line's starting point, and not its center point
                    let myTransformX = x - x * Math.cos(rotationAngle) + y * Math.sin(rotationAngle);
                    let myTransformY = y + x * Math.sin(rotationAngle) - y * Math.cos(rotationAngle);
                    // Move to origin
                    lines[i].x = 0;
                    lines[i].y = 0;
                    // Rotate the line
                    lines[i].relativeTransform = multiply(rotate(rotationAngle), lines[i].relativeTransform);
                    // Move the line back to where it was initially relative to it's parent element taking the 
                    // rotation displacement in consideration
                    lines[i].x = locationRelativeToParentX + myTransformX;
                    lines[i].y = locationRelativeToParentY + myTransformY;
                }
            }
        }
    }
    if (elementsRemoved == true) {
        elementsRemoved = false;
        rotateLines(targetPoints);
    }
}
// Return random inflection point
function getRandomPoint() {
    let randomIndex = Math.floor(Math.random() * lines.length);
    let lineRefX = Math.floor(randomIndex / nColumns);
    let lineRefY = (randomIndex % nColumns);
    return [lineRefX, lineRefY, lineRefY * paddingSize + paddingSize / 2, lineRefX * paddingSize + paddingSize / 2];
}
function selectTwoClosestPoints(lineIndex, points) {
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
        let pointOne;
        let pointTwo;
        let distances = [];
        let smallestDistance = paddingSize * paddingSize;
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
        smallestDistance = paddingSize * paddingSize;
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
function preprocessInflectionPoints(lineIndex, points) {
    let output = [];
    // 0 inflection points
    if (points.length < 1) {
        output.push(0);
        output.push(null);
    }
    // Only one inflection point
    else if (points.length == 1) {
        let targetInArray = points[0][0] * nColumns + points[0][1];
        // If current line is an inflection point
        if (targetInArray == lineIndex) {
            output.push(-1);
            output.push(null);
        }
        else {
            let distance = pointsDistance(lines[lineIndex].x, points[0][2], lines[lineIndex].y, points[0][3]);
            output.push(1);
            output.push(distance);
            output.push(points[0]);
        }
    }
    // At least two inflection points
    else {
        output.push(points.length);
        let distancesSum = 0;
        for (let i = 0; i < points.length; i++) {
            let targetInArray = points[i][0] * nColumns + points[i][1];
            // If current line is an inflection point
            if (targetInArray == lineIndex) {
                output = [];
                output.push(-1);
                output.push(null);
                return output;
            }
            // Find the closest inflection point to the line
            else {
                let distance = pointsDistance(lines[lineIndex].x, points[i][2], lines[lineIndex].y, points[i][3]);
                distancesSum += distance;
                output.push(points[i]);
            }
        }
        output.splice(1, 0, distancesSum);
    }
    return output;
}
// Combines two transforms by doing a matrix multiplication.
// The first transform applied is a, followed by b, which
// is normally written b * a.
function multiply(a, b) {
    return [
        [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1], a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2]],
        [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1] + 0, a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2]]
    ];
}
// Creates a "move" transform.
function move(x, y) {
    return [
        [1, 0, x],
        [0, 1, y]
    ];
}
// Creates a "rotate" transform.
function rotate(theta) {
    return [
        [Math.cos(theta), Math.sin(theta), 0],
        [-Math.sin(theta), Math.cos(theta), 0]
    ];
}
function clearLines() {
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].removed) {
            continue;
        }
        else {
            lines[i].remove();
        }
    }
    lines.splice(0, lines.length);
}
