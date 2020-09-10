// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
let nRows;
let nColumns;
let paddingSize;
let baseWidth;
let distanceResize = false;
const lines = [];
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
        rotateLines(getRandomPoint());
    }
    if (msg.type === 'rotate-lines') {
        rotateLines(getRandomPoint());
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
function createGrid(msg) {
    nRows = msg.rows;
    nColumns = msg.columns;
    paddingSize = msg.padding;
    baseWidth = msg.widthSize;
    //const lines: SceneNode[] = [];
    //let elements = msg.count * msg.count;
    let elements = nRows * nColumns;
    // Max diagonal
    let maxDistance = nRows > nColumns ? paddingSize * nRows * Math.SQRT2 : paddingSize * nColumns * Math.SQRT2;
    //let maxDistance = paddingSize*msg.count*Math.SQRT2;
    // Create and rotate the lines in the array
    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nColumns; j++) {
            // Create a line at the center of the padding
            const newLine = figma.createLine();
            let centerPaddingOffset = paddingSize - baseWidth;
            newLine.resize(baseWidth, 0);
            newLine.x = j * paddingSize + centerPaddingOffset;
            newLine.y = i * paddingSize + paddingSize / 2;
            // Add line to document and to array
            figma.currentPage.appendChild(newLine);
            lines.push(newLine);
        }
    }
    figma.currentPage.selection = lines;
    figma.viewport.scrollAndZoomIntoView(lines);
}
function rotateLines(targetPoint) {
    // Get targer point position in grid
    let targetInArray = targetPoint[0] * nColumns + targetPoint[1];
    let targetPosX = targetPoint[1] * paddingSize;
    let targetPosY = targetPoint[0] * paddingSize;
    for (let i = 0; i < lines.length; i++) {
        // Reset line rotation, width and position
        lines[i].rotation = 0;
        lines[i].resize(baseWidth, 0);
        let centerPaddingOffset = paddingSize - baseWidth;
        lines[i].x = (i % nColumns) * paddingSize + centerPaddingOffset;
        lines[i].y = (Math.floor(i / nColumns)) * paddingSize + paddingSize / 2;
        // Deal with line that is a target point
        if (i == targetInArray) {
            lines[i].resize(0.01, 0);
            lines[i].x = lines[i].x + baseWidth / 2;
        }
        // Deal with the other lines
        else {
            let hypotenuse = pointsDistance(lines[i].x, targetPosX, lines[i].y, targetPosY);
            if (distanceResize == true) {
                // Resize based on the distance
                let widthResize = (paddingSize / hypotenuse) < 1 ? 3 * (paddingSize / hypotenuse) : 1;
                if (widthResize > 1) {
                    widthResize = 1;
                }
                let newWidth = widthResize * lines[i].width;
                lines[i].resize(newWidth, 0);
                // Fix position based on the resize
                lines[i].x = lines[i].x + (baseWidth - newWidth) / 2;
            }
            // Referência p/ rotação: https://spectrum.chat/figma/extensions-and-api/relative-transform-point-of-rotation~7aa16373-9709-49b8-9145-5f3830ddfe32
            // Figure out where the current line is relative to its parent
            let locationRelativeToParentX = lines[i].x;
            let locationRelativeToParentY = lines[i].y;
            // Get the center of the rotation-point based on the line size
            let x = lines[i].width / 2;
            let y = 0;
            // oc/hypotenuse = opposite cathetus / hypotenuse = sin(angle)
            // ac/hypotenuse = adjacent cathetus / hypotenuse = cos(angle)
            let oc = targetPosY - locationRelativeToParentY;
            let ac = targetPosX - locationRelativeToParentX;
            // Get rotation angle based on the distance to the target
            let rotationAngle = Math.atan(oc / ac);
            // Force Deviation reflected by Rotation "error"
            rotationAngle += 75 * Math.PI / 180;
            // Transforms to fix line position because the rotation is done around line's starting point, and not its center point
            let myTransformX = x - x * Math.cos(rotationAngle) + y * Math.sin(rotationAngle);
            let myTransformY = y - x * Math.sin(rotationAngle) - y * Math.cos(rotationAngle);
            // This is the final Transform matrix that'll do the translation + rotation
            // The final transform is [[cos(angle), sin(angle), translationX][-sin(angle), cos(angle), translationY]]
            // The angle depicted in the last comment is the rotation angle
            let myRotationTransform = [[Math.cos(rotationAngle), -Math.sin(rotationAngle), myTransformX], [Math.sin(rotationAngle), Math.cos(rotationAngle), myTransformY]];
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
    return [lineRefX, lineRefY];
}
