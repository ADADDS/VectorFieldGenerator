import './ui.css'

const rowInput = document.getElementById('rows') as HTMLInputElement;
const columnInput = document.getElementById('columns') as HTMLInputElement;
const paddingInput = document.getElementById('padding') as HTMLInputElement;
const cellSizeInput = document.getElementById('cell-size') as HTMLInputElement;
//const widthSizeInput = document.getElementById('width-size') as HTMLInputElement;
const strokeWeightInput = document.getElementById('stroke-weight') as HTMLInputElement;
const colorPickerInput = document.getElementById('colorPicker') as HTMLInputElement;
const colorHexInput = document.getElementById('colorHexa') as HTMLInputElement;
const colorAlphaInput = document.getElementById('ColorAlpha') as HTMLInputElement;
const passiveRotationInput = document.getElementById('PassiveRotation') as HTMLInputElement;
const widthReductionInput = document.getElementById('WidthReduction') as HTMLInputElement;
const generateButton = document.getElementById('generate') as HTMLButtonElement;
const randomizeButton = document.getElementById('randomizer') as HTMLButtonElement;
//const resetButton = document.getElementById("ResetDefault") as HTMLButtonElement;
//const formElement = document.getElementById("Main") as HTMLFormElement;
const arrowStyleInput = document.getElementById("custom-select") as HTMLInputElement;

let invalid_answers = Array(6).fill(0);
let hasChanged = true;

let inputs = document.getElementsByClassName("input");
let sliders = document.getElementsByClassName("sliderInput");

// Check if Input Field value is valid
function validate(event) {
    let inputElement: HTMLInputElement = event.target;
    let errorText = inputElement.parentElement.getElementsByClassName("errorText")[0];
    let errorContent = errorText.parentElement;
    let value = inputElement.value;
    let validation: [boolean, string];
    let field_number: number = -1;

    switch(inputElement.id) {
        case "columns":
            field_number = 0;
            validation = integerValidate(value, 1, 50);
            //return
            break;
        case "rows":
            field_number = 1;
            validation = integerValidate(value, 1, 50);
            //return;
            break;
        case "padding":
            field_number = 2;
            validation = integerValidate(value, 0, 999);
            //return;
            break;
        case "cell-size":
            field_number = 3;
            validation = integerValidate(value, 1, 999);
            //return;
            break;
        case "stroke-weight":
            field_number = 4;
            validation = integerValidate(value, 1, 99);
            //return
            break;
        case "colorHexa":
            field_number = 5;
            validation = hexadecimalValidate(value);
            //return;
            break;
        default:
            return;
    }
    
    if (validation[0] == true) {
        hasChanged = true;
        if (errorContent != undefined) {
            errorContent.style.display = "none"
        }
        inputElement.setCustomValidity("");
        invalid_answers[field_number] = 0;
        enableDisableButton();
    }
    else {
        if (errorContent != undefined) {
            errorContent.style.display = "inline-block"
            errorText.innerHTML = validation[1];
        }
        inputElement.setCustomValidity(validation[1]);
        invalid_answers[field_number] = 1;
        enableDisableButton();
    }
}

// Attach validate function to any input field when change event occurs
for (let i=0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", validate, false);
}

// Keep track of sliders changes too
for (let i=0; i < sliders.length; i++) {
    sliders[i].addEventListener("change", () => {
        hasChanged = true;
    })
}

arrowStyleInput.addEventListener("change", () => {
    hasChanged = true;
})

// Check if any of the inputs are invalid, disabling the generate button when at least one entry is invalid
function enableDisableButton() {
    for (let i = 0; i < invalid_answers.length; i++) {
        if (invalid_answers[i] == 1) {
            generateButton.disabled = true;
            return false
        }
    }
    generateButton.disabled = false;
    return true;
}

// Check if string is a valid integer entry, choosing the right error message when necessary
function integerValidate(value: any, min: number, max: number): [boolean, string] {
    let validInput: boolean = false;
    let errorMessage: string = "";
    let regExp = /^-?\d+$/;
    
    if (!regExp.test(value)) {
        validInput = false;
        errorMessage = "Value must be an integer number" + "."
    }
    else 
    {
        let parsedValue = parseInt(value, 10);   
        if (parsedValue < min) {
            validInput = false;
            errorMessage = "Value must be greater than " + min.toString() + ".";
        }
        else if (parsedValue <= max) {
            validInput = true;
        }
        else {
            validInput = false;
            errorMessage = "Value must be smaller than " + max.toString() + ".";
        }
    }

    return [validInput, errorMessage];
}

// Check if string is a valid hexadecimal entry, choosing the right error message when necessary
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
        colorPickerInput.value = "#FFFFFF";
        return [false, "Color must be a valid hexadecimal number."];
    }
}

// Send the input values to plugin code via message
generateButton.addEventListener("click", sendGenerateMessage);

// BUTTON REMOVED FOR NOW
/*// Reset the input fields to its default values and re-validate to remove warnings
resetButton.addEventListener("click", () => {
    formElement.reset();
    dispatchChangeEvents();
})*/

// Synchronize ColorPicker and ColorHexa fields
colorPickerInput.addEventListener("change", () => {
    colorHexInput.value = colorPickerInput.value;
})

// Fill the input fields with random values and re-validate to remove warnings
randomizeButton.addEventListener("click", () => {
    // Value is 10 to 30
    let randomValue = (Math.floor(Math.random()*21)+10).toString(10);
    rowInput.value = randomValue;
    columnInput.value = randomValue;
    // Value is from 50 to 200, in increments of 10
    let size = ((Math.floor(Math.random()*16)*10)+50);
    randomValue = size.toString(10);
    paddingInput.value = randomValue;
    cellSizeInput.value = randomValue;
    hasChanged = true;
    randomValue = (Math.floor(size/20)).toString(10);
    // Value is CellSize/20
    strokeWeightInput.value = randomValue;
    // Reset interface to all-valid state
    dispatchChangeEvents();
    sendGenerateMessage();
})

// Close plugin when escape key is pressed
document.addEventListener('keydown', (e) => {
    if (e.key == "Esc" || e.key == "Escape") {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
    }
})

// Receive and Hexadecimal and an Alpha and return a Paint object compatible to Figma's paint type
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

// Dispatch change events to trigger input fields' validation function
function dispatchChangeEvents() {
    var chgEvent = new Event("change");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].dispatchEvent(chgEvent);
    }
}

// Given an initial hexadecimal string, complete it to be 6 characters long
function completeHexa(initialInput: string){
    let finalInput: string; 

    if (initialInput.length == 2) {
        finalInput = initialInput.repeat(3); 
    }
    else if (initialInput.length < 6) {
        finalInput = initialInput + initialInput[(initialInput.length) - 1].repeat(6 - initialInput.length); 
    }
    else if(initialInput.length == 6) {
        finalInput = initialInput;
    }

    return finalInput;  
}  

function sendGenerateMessage() {
    let rows = parseInt(rowInput.value, 10);
    let columns = parseInt(columnInput.value, 10);
    let padding = parseInt(paddingInput.value, 10);
    let cellSize = parseInt(cellSizeInput.value, 10);
    let strokeWeight = parseInt(strokeWeightInput.value, 10);
    let colorAlpha = parseInt(colorAlphaInput.value, 10);
    let colorHex = colorHexInput.value;
    if (colorHex.length == 6) {
        colorHex = "#" + colorHex
    }
    let paint = paintCreator(colorHex, colorAlpha);
    let passiveRotation = passiveRotationInput.checked;
    let widthReduction = widthReductionInput.checked;
    let arrowStyle: string;
    switch(arrowStyleInput.value) {
        case "None":
            arrowStyle = "NONE";
            break;
        case "Line Arrow":
            arrowStyle = "ARROW_LINES";
            break;
        case "Triangle Arrow":
            arrowStyle = "ARROW_EQUILATERAL";
    }
    parent.postMessage({ pluginMessage: { type: 'generate-grid', rows, columns, padding, cellSize, strokeWeight, paint, passiveRotation, widthReduction, hasChanged, arrowStyle} }, '*')
    hasChanged = false;
}