import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const clearBtn = document.getElementById('clear');
const equalsBtn = document.getElementById('equals');

let currentValue = '';
let previousValue = '';
let operation = null;

buttons.forEach(button => {
    if (button.classList.contains('num') || button.classList.contains('op')) {
        button.addEventListener('click', () => {
            handleInput(button.textContent);
        });
    }
});

clearBtn.addEventListener('click', clearDisplay);
equalsBtn.addEventListener('click', calculate);

function handleInput(value) {
    if (value === '.' && currentValue.includes('.')) return;
    
    if (['+', '-', '*', '/'].includes(value)) {
        if (operation !== null) calculate();
        operation = value;
        previousValue = currentValue;
        currentValue = '';
    } else {
        currentValue += value;
    }
    updateDisplay();
}

function updateDisplay() {
    display.value = currentValue || '0';
}

function clearDisplay() {
    currentValue = '';
    previousValue = '';
    operation = null;
    updateDisplay();
}

async function calculate() {
    if (previousValue === '' || currentValue === '') return;

    const num1 = parseFloat(previousValue);
    const num2 = parseFloat(currentValue);
    let result;

    try {
        switch (operation) {
            case '+':
                result = await backend.add(num1, num2);
                break;
            case '-':
                result = await backend.subtract(num1, num2);
                break;
            case '*':
                result = await backend.multiply(num1, num2);
                break;
            case '/':
                const divisionResult = await backend.divide(num1, num2);
                if (divisionResult === null) {
                    throw new Error('Division by zero');
                }
                result = divisionResult;
                break;
        }

        currentValue = result.toString();
        previousValue = '';
        operation = null;
        updateDisplay();
    } catch (error) {
        display.value = 'Error';
        console.error('Calculation error:', error);
    }
}

updateDisplay();
