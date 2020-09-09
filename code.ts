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
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};

function pointsDistance(x1, x2, y1, y2) {
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function createGrid(msg) {
  nRows = msg.rows;
  nColumns = msg.columns;
  paddingSize = msg.padding; 
  baseWidth = msg.widthSize;

  // Random inflection point
  let lineRefX = Math.floor(Math.random() * nColumns);
  let lineRefY = Math.floor(Math.random() * nRows);
  // Random point position
  let refX = lineRefX * paddingSize;
  let refY = lineRefY * paddingSize;

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
      let centerPaddingOffset = paddingSize - baseWidth
      newLine.resize(baseWidth, 0);
      newLine.x = j*paddingSize + centerPaddingOffset;
      newLine.y = i*paddingSize + paddingSize/2;
    
      // Get distance do target point
      let hypotenuse = pointsDistance(newLine.x, refX, newLine.y, refY);

      // If it's the "inflection line"
      if (j == lineRefX && i == lineRefY){
        newLine.resize(0.01, 0);
        newLine.x = newLine.x + baseWidth/2
      }
      // Else, it's a regular line, resize then rotate
      else {
        // Resize based on the distance

        /*
        let widthResize = (paddingSize/hypotenuse) < 1 ? 3*(paddingSize/hypotenuse) : 1;
        if (widthResize > 1) {
          widthResize = 1;
        }
        let newWidth = widthResize*newLine.width;
        newLine.resize(newWidth, 0);
        // Fix position based on the resize
        newLine.x = newLine.x + (baseWidth - newWidth)/2;
        */

        // Referência p/ rotação: https://spectrum.chat/figma/extensions-and-api/relative-transform-point-of-rotation~7aa16373-9709-49b8-9145-5f3830ddfe32
        // Figure out where the current line is relative to its parent
        let locationRelativeToParentX = newLine.x;
        let locationRelativeToParentY = newLine.y;
    
        // Get the center of the rotation-point based on the line size
        let x = newLine.width/2;
        let y = 0;
        
        // oc/hypotenuse = opposite cathetus / hypotenuse = sin(angle)
        // ac/hypotenuse = adjacent cathetus / hypotenuse = cos(angle)
        let oc = refY - locationRelativeToParentY;
        let ac = refX - locationRelativeToParentX;
        // Get rotation angle based on the distance to the target
        let rotationAngle = Math.atan(oc/ac);
        // Force Deviation reflected by Rotation "error"
        rotationAngle += 75 * Math.PI / 180;
        
        // Transforms to fix line position because the rotation is done around line's starting point, and not its center point
        let myTransformX = x - x * Math.cos(rotationAngle) + y * Math.sin(rotationAngle);
        let myTransformY = y - x * Math.sin(rotationAngle) - y * Math.cos(rotationAngle);
  
        // This is the final Transform matrix that'll do the translation + rotation
        // The final transform is [[cos(angle), sin(angle), translationX][-sin(angle), cos(angle), translationY]]
        // The angle depicted in the last comment is the rotation angle
        let myRotationTransform = [[Math.cos(rotationAngle), -Math.sin(rotationAngle), myTransformX],[Math.sin(rotationAngle), Math.cos(rotationAngle), myTransformY]] as Transform;
        newLine.relativeTransform = myRotationTransform;
        
        // Move the line back to where it was initially relative to it's parent element
        newLine.x = newLine.x + locationRelativeToParentX;
        newLine.y = newLine.y + locationRelativeToParentY;    
      }
      // Add line to document and to array
      figma.currentPage.appendChild(newLine);
      lines.push(newLine);
    }
  }
  figma.currentPage.selection = lines;
  figma.viewport.scrollAndZoomIntoView(lines);
}