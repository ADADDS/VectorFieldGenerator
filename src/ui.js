import './ui.css';
document.getElementById('generate').onclick = () => {
    const rowInput = document.getElementById('rows');
    const columnInput = document.getElementById('columns');
    const paddingInput = document.getElementById('padding');
    const cellSizeInput = document.getElementById('cell-size');
    const widthSizeInput = document.getElementById('width-size');
    const strokeWeightInput = document.getElementById('stroke-weight');
    //const colorHexInput = document.getElementById('ColorPicker');
    const colorHexInput = document.getElementById('ColorHexa');
    const colorAlphaInput = document.getElementById('ColorAlpha');
    const WidthReductionInput = document.getElementById('WidthReduction');
    
    let rows = parseInt(rowInput.value, 10);
    if (isNaN(rows)) {
        rows = parseInt(rowInput.placeholder, 10);
    }
    let columns = parseInt(columnInput.value, 10);
    if (isNaN(columns)) {
        columns = parseInt(columnInput.placeholder, 10);
    }
    let padding = parseInt(paddingInput.value, 10);
    if (isNaN(padding)) {
        padding = parseInt(paddingInput.placeholder, 10);
    }
    let cellSize = parseInt(cellSizeInput.value, 10);
    if (isNaN(cellSize)) {
        cellSize = parseInt(cellSizeInput.placeholder, 10);
    }
    let strokeWeight = parseInt(strokeWeightInput.value, 10);
    if (isNaN(strokeWeight)) {
        strokeWeight = parseInt(strokeWeightInput.placeholder, 10);
    }
    let colorAlpha = parseInt(colorAlphaInput.value, 10);
    if (isNaN(colorAlpha)) {
        colorAlpha = parseInt(colorAlphaInput.placeholder, 10);
    }
    let colorHex = colorHexInput.value;
    if (!isValidHexa(colorHex)) {
        colorHex = colorHexInput.placeholder;
    }
    else {
        if (colorHex.length == 6)
            colorHex = "#" + colorHex;
    }
    let paint = paintCreator(colorHex, colorAlpha);
    let widthReduction = WidthReductionInput.checked;
    parent.postMessage({ pluginMessage: { type: 'generate-grid', rows, columns, padding, cellSize, strokeWeight, paint, widthReduction } }, '*');
};
document.getElementById('randomizer').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'rotate-lines' } }, '*');
};
document.addEventListener('keydown', (e) => {
    if (e.key == "Esc" || e.key == "Escape") {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
    }
});
/*
document.getElementById('ColorPicker').onchange = (evt) => {
    document.getElementById('ColorHexa').value = evt.srcElement.value
}

document.getElementById('ColorHexa').onchange = (evt) => {
    document.getElementById('ColorPicker').value = evt.srcElement.value
}
*/
function isValidHexa(string) {
    let possibleHexa;
    if (string.length == 7) {
        if (string[0] == '#') {
            possibleHexa = string.slice(1);
        }
        else {
            return false;
        }
    }
    else if (string.length == 6) {
        possibleHexa = string;
    }
    else {
        return false;
    }
    let regexp = /[0-9A-Fa-f]{6}/;
    if (regexp.test(possibleHexa)) {
        return true;
    }
    else {
        return false;
    }
}
function paintCreator(hex, alpha) {
    let red = 0, grn = 0, blu = 0, a = 0;
    red = "0x" + hex[1] + hex[2];
    grn = "0x" + hex[3] + hex[4];
    blu = "0x" + hex[5] + hex[6];
    red = +(red / 255);
    grn = +(grn / 255);
    blu = +(blu / 255);
    a = alpha / 100;
    return [{ opacity: a, color: { r: red, g: grn, b: blu }, type: 'SOLID' }];
}

// se a pessoa digitar um numero menor de 6 caracteres no input do color hexa, essa funcao pegar o ultimo digito e duplica até dar 6
function completeHexa(string){
    let possibleHexa;

}

// desculpa
function validate() {
    var InputColumns = document.getElementsByClassName('columns').value;
    if (InputColumns < 0) {
        // o inputcolumns_negative_number ia ser o id da div que tem o icone (!) e a mensagem especifica pra esse caso 
        $('InputColumns_negative_number').show();
        return true;
    }else {
        return false;
    }
}