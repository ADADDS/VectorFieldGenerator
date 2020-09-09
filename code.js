// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-rectangles') {
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
        let nRows = msg.rows;
        let nColumns = msg.columns;
        let paddingSize = msg.padding;
        let baseWidth = msg.widthSize;
        // Random inflection point
        let lineRefX = Math.floor(Math.random() * nColumns);
        let lineRefY = Math.floor(Math.random() * nRows);
        // Random point position
        let refX = lineRefX * paddingSize;
        let refY = lineRefY * paddingSize;
        const lines = [];
        //let elements = msg.count * msg.count;
        let elements = nRows * nColumns;
        // Max diagonal
        let maxDistance = nRows > nColumns ? paddingSize * nRows * Math.SQRT2 : paddingSize * nColumns * Math.SQRT2;
        //let maxDistance = paddingSize*msg.count*Math.SQRT2;
        // Create and rotate the lines in the array
        for (let i = 0; i < elements; i++) {
            const newLine = figma.createLine();
            let xOffset = i % nColumns;
            let yOffset = Math.floor(i / nColumns);
            newLine.x = xOffset * paddingSize;
            newLine.y = yOffset * paddingSize;
            newLine.resize(baseWidth, 0);
            //newLine.rotation = ((Math.random() * 360) * Math.PI)/180
            //figma.currentPage.appendChild(newLine);
            //lines.push(newLine);
            // Referência p/ rotação: https://spectrum.chat/figma/extensions-and-api/relative-transform-point-of-rotation~7aa16373-9709-49b8-9145-5f3830ddfe32
            // Figure out where the current line is relative to its parent
            let locationRelativeToParentX = newLine.x;
            let locationRelativeToParentY = newLine.y;
            // Calcula a distância entre a linha atual e a linha alvo
            let hypotenuse = pointsDistance(locationRelativeToParentX, refX, locationRelativeToParentY, refY);
            // Check if current Line is not the "target" line. If it's not, then it should be rotated
            if (hypotenuse != 0) {
                // Get the center of the rotation-point based on the line size
                let x = newLine.width / 2;
                let y = 0;
                // oc/hypotenuse = opposite cathetus / hypotenuse = sin(angle)
                // ac/hypotenuse = adjacent cathetus / hypotenuse = cos(angle)
                let oc = refY - locationRelativeToParentY;
                let ac = refX - locationRelativeToParentX;
                // Tg = oc/ac
                let rotationAngle = Math.atan(oc / ac);
                // Force Deviation reflected by Rotation "error"
                rotationAngle += 75 * Math.PI / 180;
                // Obs: Essas transformações são responsáveis pela translação das linhas. Como a rotação não é dada no centro do objeto,
                // Essa translação corrige a posição do objeto para que a rotação pareça ter sido feita no seu centro
                //let myTransformX = x - x * (ca/hipotenusa) + y * (co/hipotenusa);
                //let myTransformY = y - x * (co/hipotenusa) - y * (ca/hipotenusa);
                let myTransformX = x - x * Math.cos(rotationAngle) + y * Math.sin(rotationAngle);
                let myTransformY = y - x * Math.sin(rotationAngle) - y * Math.cos(rotationAngle);
                // This is the final Transform matrix that'll do the translation + rotation
                // The final transform is [[cos(angle), sin(angle), translationX][-sin(angle), cos(angle), translationY]]
                // The angle depicted in the last comment is the rotation angle
                // let myRotationTransform = [[(ca/hipotenusa), -(co/hipotenusa), myTransformX], [(co/hipotenusa), (ca/hipotenusa), myTransformY]] as Transform;
                let myRotationTransform = [[Math.cos(rotationAngle), -Math.sin(rotationAngle), myTransformX], [Math.sin(rotationAngle), Math.cos(rotationAngle), myTransformY]];
                newLine.relativeTransform = myRotationTransform;
                // Move the line back to where it was initially
                newLine.x = newLine.x + locationRelativeToParentX;
                newLine.y = newLine.y + locationRelativeToParentY;
                // let widthResize = hipotenusa/maxDistance;
                // let widthResize = (hipotenusa/maxDistance) > 0.5 ? 1 : 2*(hipotenusa/maxDistance);
                let widthResize = (paddingSize / hypotenuse) < 1 ? 3 * (paddingSize / hypotenuse) : 1;
                if (widthResize > 1) {
                    widthResize = 1;
                }
                newLine.resize(widthResize * newLine.width, 0);
            }
            else {
                newLine.resize(0.01, 0);
            }
            figma.currentPage.appendChild(newLine);
            lines.push(newLine);
        }
        figma.currentPage.selection = lines;
        figma.viewport.scrollAndZoomIntoView(lines);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};
function pointsDistance(x1, x2, y1, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
