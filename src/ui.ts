import './ui.css'

const rowInput = document.getElementById('rows') as HTMLInputElement;
const columnInput = document.getElementById('columns') as HTMLInputElement;
const paddingInput = document.getElementById('padding') as HTMLInputElement;
const cellSizeInput = document.getElementById('cell-size') as HTMLInputElement;
const widthSizeInput = document.getElementById('width-size') as HTMLInputElement;
const strokeWeightInput = document.getElementById('stroke-weight') as HTMLInputElement;
const colorPickerInput = document.getElementById('ColorPicker') as HTMLInputElement;
const colorHexInput = document.getElementById('ColorHexa') as HTMLInputElement;
const colorAlphaInput = document.getElementById('ColorAlpha') as HTMLInputElement;
const WidthReductionInput = document.getElementById('WidthReduction') as HTMLInputElement;

let inputs = document.getElementsByClassName("input");

function validate(event) {
    let inputElement: HTMLInputElement = event.target;
    let error: HTMLElement = event.target.parentNode.getElementsByClassName("error")[0];
    let valor = parseInt(inputElement.value, 10);
    switch(inputElement.id) {
        case "rows":
            if (isNaN(valor)) {
                error.style.display = "block";
                error.innerHTML = "Tem que ser um numero";
            }
            else if (valor < 1) {
                error.style.display = "block";
                error.innerHTML = "Tem que ser maior que 1";
            }
            else if (valor <= 50) {
                error.style.display = "none";
            }
            else {
                error.style.display = "block";
                error.innerHTML = "Tem que ser menor que 50";
            }
            break;
        case "columns":
            break;
        case "padding":
            break;
        case "cell-size":
            break;
    }
}

for (let i=0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", validate, false);
}

// desculpa
/*
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
*/

document.getElementById('generate').onclick = () => {
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
        colorHex = "#" + colorHex
    }
    let paint = paintCreator(colorHex, colorAlpha);
    let widthReduction = WidthReductionInput.checked;
    parent.postMessage({ pluginMessage: { type: 'generate-grid', rows, columns, padding, cellSize, strokeWeight, paint, widthReduction} }, '*')
}


document.getElementById('randomizer').onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'rotate-lines' } }, '*')
}

document.addEventListener('keydown', (e) => {
    if (e.key == "Esc" || e.key == "Escape") {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
    }
})

colorPickerInput.addEventListener("change", (evt) => {
    colorHexInput.value = colorPickerInput.value;
})

colorHexInput.addEventListener("change", (evt) => {
    colorPickerInput.value = colorHexInput.value;
})

/*
document.getElementById('ColorPicker').onchange = (evt) => {
    (<HTMLInputElement>document.getElementById('ColorHexa')).value = (<HTMLInputElement>evt.target).value
}

document.getElementById('ColorHexa').onchange = (evt) => {
    (<HTMLInputElement>document.getElementById('ColorPicker')).value = (<HTMLInputElement>evt.target).value
}
*/

function isValidHexa(string) {
    let possibleHexa
    if (string.length == 7) {
        if (string[0] == '#') {
        possibleHexa = string.slice(1)
        }
        else {
        return false
        }
    }
    else if (string.length == 6) {
        possibleHexa = string
    }
    else {
        return false
    }

    let regexp = /[0-9A-Fa-f]{6}/
    if (regexp.test(possibleHexa)) {
        return true
    }
    else {
        return false
    }
}

function paintCreator(hex, alpha) {
    let red:any = 0, grn:any = 0, blu:any = 0, a:number = 0;
    red = "0x" + hex[1] + hex[2];
    grn = "0x" + hex[3] + hex[4];
    blu = "0x" + hex[5] + hex[6];

    red = +(red / 255);
    grn = +(grn / 255);
    blu = +(blu / 255);
    a = alpha / 100;

    return [{opacity: a, color: { r: red, g: grn, b: blu }, type: 'SOLID' }];
}

function completeHexa(){
    let initialInput: string = (<HTMLInputElement>document.getElementById("ColorHexa")).value;
    let finalInput: string; 

    if (initialInput.length < 6 && initialInput.length != 2) {
        finalInput = initialInput + initialInput[(initialInput.length) - 1].repeat(6 - initialInput.length); 
    }
    
    if (initialInput.length == 2) {
        finalInput = initialInput.repeat(3); 
    }

    return finalInput;  
}  