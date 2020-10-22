import * as utils from "./utils";

let nRows: number;
let nColumns: number;
let paddingSize: number;
let baseWidth: number;
let distanceResize = false;
let passiveRotation = false;
let strokeWeight: number;
let capStyle: string;
let startingPoint = { 
  x: 0, y: 0 
};
let paint: any;
const lines: VectorNode[] = [];

// Handle the generate-button action
export function handleGenerate(msg) {
    clearLines(msg.hasChanged);
    if (gridEmpty()) {
        nRows = msg.rows;
        nColumns = msg.columns;
        paddingSize = msg.padding + msg.cellSize; 
        baseWidth = msg.cellSize;
        strokeWeight = msg.strokeWeight;
        distanceResize = msg.widthReduction;
        passiveRotation = msg.passiveRotation;
        paint = msg.paint;
        capStyle = msg.arrowStyle;
        generateGrid();
    } 

    if (squareExampleMatrix()) {
        rotateLines(getRandomPoints(1));
    }
    else {
        let randomTests = Math.floor(Math.random()*7);
        //let randomTests = 1;
        if (randomTests <= 3) {
            rotateLines(getRandomPoints(1));
        }
        else if (randomTests <= 5) {
            rotateLines(getRandomPoints(2));
        }
        else {
            rotateLines(getRandomPoints(3));      
        }
    }
}

// Generate the Vectors Grid
function generateGrid() {
    startingPoint.x = figma.viewport.center.x - (nColumns/2) * paddingSize;
    startingPoint.y = figma.viewport.center.y - (nRows/2) * paddingSize;
  
    // Create the line in the center of its padding, append it to the document and push it to the array
    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nColumns; j++){
            const newLine = figma.createVector();
            newLine.vectorPaths = [{
                windingRule: "EVENODD",
                data: "M 0 0 L 100 0 Z"
            }];
            newLine.resize(baseWidth, 0);
            
            let centerPaddingOffset = (paddingSize - baseWidth)/2;
            newLine.x = j*paddingSize + centerPaddingOffset + startingPoint.x;
            newLine.y = i*paddingSize + paddingSize/2 + startingPoint.y; 
            //newLine.x = j*paddingSize + startingPoint.x;
            //newLine.y = i*paddingSize + startingPoint.y;

            newLine.strokes = paint;
            newLine.strokeWeight = strokeWeight;
            // Change the strokeCap attribute of the vertex at the end of the vector 
            let vecNetwork = JSON.parse(JSON.stringify(newLine.vectorNetwork));
            vecNetwork.vertices[1].strokeCap = capStyle;
            newLine.vectorNetwork = vecNetwork;
            // Add line to document and to array
            figma.currentPage.appendChild(newLine);
            lines.push(newLine);
        }
    }
    figma.group(lines, figma.currentPage);
    figma.currentPage.selection = lines;
    //figma.viewport.scrollAndZoomIntoView(lines);
}

// Rotate and resize the lines according to the inflection points
function rotateLines(targetPoints) {
    let elementsRemoved = false;
    let elements = nRows * nColumns;
    
    if (targetPoints.length > elements) {
        targetPoints.splice(elements, (targetPoints.length - elements))
    }
  
    for (let i = lines.length - 1 ; i >= 0; i--) {
        if (lines[i].removed) {
            lines.splice(i, 1);
            elementsRemoved = true;
        }
        else {
            // If there are removed elements, only pre-process the field
            if (elementsRemoved == true) {
                continue;
            }
            // Rotate elements normally
            else {
                // Reset line rotation, width and position
                lines[i].rotation = 0;
                lines[i].resize(baseWidth, 0);
                
                let centerPaddingOffset = (paddingSize - baseWidth)/2;
                lines[i].x = (i%nColumns)*paddingSize + centerPaddingOffset + startingPoint.x;
                lines[i].y = (Math.floor(i/nColumns))*paddingSize + paddingSize/2 + startingPoint.y;
                //lines[i].x = (i%nColumns)*paddingSize + startingPoint.x;
                //lines[i].y = (Math.floor(i/nColumns))*paddingSize + startingPoint.y;

                // Select target point/points
                let inflectionPoints = preprocessInflectionPoints(i, targetPoints);
        
                // Deal with line that is a target point
                if (inflectionPoints[0] == -1) {
                    lines[i].resize(0.01, 0);
                    //lines[i].x = lines[i].x + baseWidth/2;
                    let vecNetwork = JSON.parse(JSON.stringify(lines[i].vectorNetwork));
                    vecNetwork.vertices[1].strokeCap = "NONE";
                    lines[i].vectorNetwork = vecNetwork;
                }
                // Deal with the other lines
                else {
                    let ocSum = 0;
                    let acSum = 0;
                    let smallestDistance = selectClosestPoint(i, targetPoints);
                    let vecNetwork = JSON.parse(JSON.stringify(lines[i].vectorNetwork));
                    vecNetwork.vertices[1].strokeCap = capStyle;
                    lines[i].vectorNetwork = vecNetwork;

                    // If Size-Reduction is selected
                    if (distanceResize == true) {
                        // Resize based on the distance
                        let reducingFactor = smallestDistance[0] / paddingSize;
                        let widthResize;
                        //let elements = nRows * nColumns;
                        let limitSquared = Math.sqrt(elements);

                        if (limitSquared < 10) {
                            widthResize = 1 - reducingFactor/limitSquared;
                        }
                        else if (limitSquared >= 10 && limitSquared < 20) {
                            if (reducingFactor <= 3) {
                                widthResize = Math.pow(reducingFactor, 2)/9;
                            }
                            else {
                                widthResize = 1 - Math.log((reducingFactor-2))/2.5;
                            }
                        }
                        else {
                            /*
                            if (reducingFactor <= 4) {
                                widthResize = Math.pow(reducingFactor, 2)/16
                            }
                            else {
                                widthResize = 1/Math.log10(reducingFactor) - 0.6;
                            }*/
                            widthResize = 1/Math.log10(reducingFactor+1) - 0.6;
                        }
        
                        if (widthResize > 1) {
                            widthResize = 1;
                        }
                        else if (widthResize < 0.15) {
                            widthResize = 0.15;
                        }
                        let newWidth = widthResize*lines[i].width;
                        lines[i].resize(newWidth, 0);
                        // Fix position based on the resize
                        //lines[i].x = lines[i].x + (baseWidth - newWidth)/2;
                    }

                    let rotationAngle;
                    // Figure out where the current line is relative to its parent
                    let locationRelativeToParentX = lines[i].x;
                    let locationRelativeToParentY = lines[i].y;

                    // If there's only one point affecting the Rotation
                    if (inflectionPoints[0] == 1) {
                        // Get its OC and AC then calculate its rotation angle
                        ocSum = ocSum + inflectionPoints[2][3] - locationRelativeToParentY;
                        acSum = acSum + inflectionPoints[2][2] - locationRelativeToParentX;
                        if (acSum == 0) {
                            rotationAngle = Math.PI/2;
                        }
                        else {
                            rotationAngle = -Math.atan(ocSum/acSum);
                        }
                    }
                    // If there are two or more points affecting the rotation
                    else if (inflectionPoints[0] >= 2 ) {
                        let maxDistance = inflectionPoints[1];
                        for(let j = 2; j < inflectionPoints.length; j++) {
                            let pointAc = inflectionPoints[j][2] - locationRelativeToParentX
                            let pointOc = inflectionPoints[j][3] - locationRelativeToParentY;
                            let hypotenuse = utils.pointsDistance(lines[i].x, inflectionPoints[j][2], lines[i].y, inflectionPoints[j][3]);
                            // Point influence is inversely proportional to its distance to the line being rotated
                            ocSum = ocSum + pointOc/Math.pow(hypotenuse,2); 
                            acSum = acSum + pointAc/Math.pow(hypotenuse,2);
                        }
                        if (acSum == 0) {
                            rotationAngle = Math.PI/2;
                        }
                        else {
                            rotationAngle = -Math.atan(ocSum/acSum);
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
                
                    // Force Deviation reflected by distance to the inflection point
                    if (passiveRotation == true){
                        let deviation = smallestDistance[0]/paddingSize * 9;
                        rotationAngle = rotationAngle + deviation * Math.PI / 180;
                    }
                
                    // Rotate the lines using the rotation attribute from Figma elements
                    let rotationDegree = rotationAngle * 180/Math.PI;
                    lines[i].rotation = rotationDegree;
                }
            }
        }
    }
    if (elementsRemoved == true) {
      elementsRemoved = false;
      rotateLines(targetPoints);
    }
}

// Return a random inflection point
function getRandomPoints(n) {
    let points: any = [];
    let numbers = [];
    while (numbers.length < n) {
        let randomIndex = Math.floor(Math.random() * lines.length);
        if (numbers.indexOf(randomIndex) == -1) {
            numbers.push(randomIndex);
        }
    }
    for (let i = 0; i < n; i++) {
        let pointIndex = numbers[i];
        let lineRefX = Math.floor(pointIndex/nColumns);
        let lineRefY = (pointIndex%nColumns);
        let centerPaddingOffset = (paddingSize - baseWidth)/2;
        let pointPosX = lineRefY * paddingSize + centerPaddingOffset + startingPoint.x;
        let pointPosY = lineRefX * paddingSize + paddingSize/2 + startingPoint.y;
        points.push([lineRefX, lineRefY, pointPosX, pointPosY]);
    }
    return points;
}
  
// Return closest point from a list of points
function selectClosestPoint(lineIndex, points) {
    let output = [];   
    // Only one inflection point
    if (points.length == 1) {
        let distance = utils.pointsDistance(lines[lineIndex].x, points[0][2], lines[lineIndex].y, points[0][3]);
        output.push(distance);
        output.push(points[0]);
    }
    // At least two inflection points
    else {
        let smallestDistance = Number.POSITIVE_INFINITY;
        let smallestIndex = -1;
        for (let i = 0; i < points.length; i++) {
            // Find the closest inflection point to the line
            let distance = utils.pointsDistance(lines[lineIndex].x, points[i][2], lines[lineIndex].y, points[i][3]);
            if (distance < smallestDistance) {
                smallestDistance = distance;
                smallestIndex = i;
            }
        }
        output.push(smallestDistance);
        output.push(points[smallestIndex]);
    }
    return output;
}
  
// Preprocess the inflection points, returning the number of points, sum of distances and all the points
function preprocessInflectionPoints(lineIndex, points) {
    let output = [];
    // Zero inflection points
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
            let distance = utils.pointsDistance(lines[lineIndex].x, points[0][2], lines[lineIndex].y, points[0][3])
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
                let distance = utils.pointsDistance(lines[lineIndex].x, points[i][2], lines[lineIndex].y, points[i][3]);
                distancesSum += distance;
                output.push(points[i]);
            }
        }
        output.splice(1, 0, distancesSum);
    }
    return output;
}
  
// Remove from the array the elements that were removed from figma. Algo clear
// all the elements from the grid when "reset" is true
function clearLines(reset) {
    for (let i = lines.length - 1 ; i >= 0; i--) {
        if (reset) {
            if (lines[i].removed) {
                continue;
            }
            else {
                lines[i].remove();
            }
        }
        else {
            if (lines[i].removed) {
                lines.splice(i, 1);
            }
            else {
                continue;
            }
        }
    }
    if (reset) {
        lines.splice(0, lines.length);
    }
}

// True if grid is a square grid
function squareExampleMatrix() {
    if (nRows == 3 && nColumns == 3) {
        return true;
    }
    return false;
}

// True if grid is empty
function gridEmpty() {
    return lines.length == 0;
}