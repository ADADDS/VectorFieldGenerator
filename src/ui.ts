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
    let error: HTMLElement = event.target.parentNode.getElementsByClassName("errorText")[0];
    let value = inputElement.value;
    let validation: [boolean, string];
    switch(inputElement.id) {
        case "rows":
            validation = integerValidate(value, 1, 50);
            break;
        case "columns":
            validation = integerValidate(value, 1, 50);
            break;
        case "padding":
            return;
            //break;
        case "cell-size":
            return;
            //break;
        case "ColorPicker":
            colorHexInput.value = colorPickerInput.value;
            return;
            //break;
        case "ColorHexa":
            validation = hexadecimalValidate(value);
            return;
            //break;
        default:
            return;
    }
    
    if (validation[0] == true) {
        error.style.display = "none"
        inputElement.setCustomValidity("");
    }
    else {
        error.style.display = "block"
        error.innerHTML = validation[1];
        inputElement.setCustomValidity(validation[1]);
    }
}

for (let i=0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", validate, false);
}

function integerValidate(value: any, min: number, max: number): [boolean, string] {
    let validInput: boolean = false;
    let errorMessage: string = "";
    let parsedValue = parseInt(value, 10);
    
    if (isNaN(parsedValue)) {
        validInput = false;
        errorMessage = "Value must be a number"
    }
    else if (parsedValue < min) {
        validInput = false;
        errorMessage = "Value must be greater than " + min.toString();
    }
    else if (parsedValue <= max) {
        validInput = true;
    }
    else {
        validInput = false;
        errorMessage = "Value must be smaller than " + max.toString();
    }

    return [validInput, errorMessage];
}

function hexadecimalValidate(value: any): [boolean, string] {
    let inputValue = value;
    let finalHex: string;

    // Check string after '#'
    if (inputValue[0] == '#' && inputValue.length > 1) {
        finalHex = inputValue.slice(1);
    }
    else {
        finalHex = inputValue;
    }

    let regexp = /^[0-9A-Fa-f]+$/
    // If it's a hexdecimal valid number
    if (regexp.test(finalHex)) {
        // Incomplete color number
        if (finalHex.length < 6) {
            finalHex = completeHexa(finalHex);
        } 
        // Invalid number, cut it to fit 6 digits
        else if (finalHex.length > 6) {
            finalHex = finalHex.slice(0, 6);
        }
        // if Length==6, it's a valid hexadecimal color number
        finalHex = '#' + finalHex
        colorPickerInput.value = finalHex;
        colorHexInput.value = finalHex;
        return [true, ""];
    }
    // Invalid hexadecimal number
    else {
        // MAKE ERROR
        colorPickerInput.value = "#FFFFFF";
        return [false, "Color must be a valid hexadecimal number"];
    }
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

/*
colorPickerInput.addEventListener("change", (evt) => {
    colorHexInput.value = colorPickerInput.value;
})

colorHexInput.addEventListener("change", (evt) => {
    let inputValue = colorHexInput.value;
    let finalHex: string;

    // Check string after '#'
    if (inputValue[0] == '#' && inputValue.length > 1) {
        finalHex = inputValue.slice(1);
    }
    else {
        finalHex = inputValue;
    }

    let regexp = /^[0-9A-Fa-f]+$/
    // If it's a hexdecimal valid number
    if (regexp.test(finalHex)) {
        // Incomplete color number
        if (finalHex.length < 6) {
            finalHex = completeHexa(finalHex);
        } 
        // Invalid number, cut it to fit 6 digits
        else if (finalHex.length > 6) {
            finalHex = finalHex.slice(0, 6);
        }
        // if Length==6, it's a valid hexadecimal color number
        finalHex = '#' + finalHex
        colorPickerInput.value = finalHex;
        colorHexInput.value = finalHex;
    }
    // Invalid hexadecimal number
    else {
        // MAKE ERROR
        colorPickerInput.value = "#FFFFFF";
        console.log("ERRO");
    }
})

*/

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



function completeHexa(initialInput: string){
    let finalInput: string; 

    if (initialInput.length == 2) {
        finalInput = initialInput.repeat(3); 
    }
    else if (initialInput.length < 6) {
        finalInput = initialInput + initialInput[(initialInput.length) - 1].repeat(6 - initialInput.length); 
    }

    return finalInput;  
}  

//    let initialInput: string = colorHexInput.value;
