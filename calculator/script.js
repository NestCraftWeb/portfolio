document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('display');
    const keys = document.querySelector('.calculator-keys');

    let currentInput = '';
    let lastInput = '';
    let resultDisplayed = false;

    function updateDisplay(value) {
        display.value = value;
    }

    function calculate(expression) {
        try {
            // Replace multiplication and division symbols with JS operators
            expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
            // Evaluate the expression safely
            // eslint-disable-next-line no-eval
            const result = eval(expression);
            return result;
        } catch (e) {
            return 'Error';
        }
    }

    keys.addEventListener('click', function (e) {
        if (!e.target.matches('button')) return;

        const key = e.target;
        const action = key.getAttribute('data-action');
        const displayedNum = display.value;

        if (action === 'clear') {
            currentInput = '';
            updateDisplay('');
            return;
        }

        if (action === 'backspace') {
            if (resultDisplayed) {
                currentInput = '';
                updateDisplay('');
                resultDisplayed = false;
                return;
            }
            currentInput = currentInput.slice(0, -1);
            updateDisplay(currentInput);
            return;
        }

        if (action === 'equals') {
            if (currentInput === '') return;
            const result = calculate(currentInput);
            updateDisplay(result);
            currentInput = result.toString();
            resultDisplayed = true;
            return;
        }

        if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
            if (resultDisplayed) {
                resultDisplayed = false;
            }
            // Prevent two operators in a row
            if (currentInput === '') return;
            const lastChar = currentInput.slice(-1);
            if (['+', '-', '*', '/'].includes(lastChar)) {
                currentInput = currentInput.slice(0, -1);
            }
            let operator = '';
            switch (action) {
                case 'add':
                    operator = '+';
                    break;
                case 'subtract':
                    operator = '-';
                    break;
                case 'multiply':
                    operator = '×';
                    break;
                case 'divide':
                    operator = '÷';
                    break;
            }
            currentInput += operator;
            updateDisplay(currentInput);
            return;
        }

        if (action === 'decimal') {
            if (resultDisplayed) {
                currentInput = '0.';
                updateDisplay(currentInput);
                resultDisplayed = false;
                return;
            }
            // Prevent multiple decimals in the current number
            const parts = currentInput.split(/[\+\-\×\÷]/);
            const lastPart = parts[parts.length - 1];
            if (lastPart.includes('.')) return;
            currentInput += '.';
            updateDisplay(currentInput);
            return;
        }

        // For numbers
        if (/\d/.test(action)) {
            if (resultDisplayed) {
                currentInput = action;
                resultDisplayed = false;
            } else {
                currentInput += action;
            }
            updateDisplay(currentInput);
        }
    });
});
