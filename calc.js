// Stores state of calculator
let calc = {
  num1: '0',
  num2: '0',
  num2Active: false,
  operator: '+',
  expression: '',
  result: '0',
  inputs: document.querySelectorAll('.input'),
  action: {
    active: true,
    operators: document.querySelectorAll('.operator')
  },
  backspace: document.querySelector('.calc-button[data-name="backspace"]'),
  equal: document.querySelector('.calc-button[data-name="equal"]'),
  equalLast: false,
  dot: document.querySelector('.calc-button[data-name="dot"]'),
  displayExpression: document.querySelector('#displayExpression'),
  displayMain: document.querySelector('#displayMain'),
  clear: document.querySelector('.calc-button[data-name="clear"]')
}

// Remove leading zeros
const removeZeros = (s) => s.split(' ').map((item) => item.replace(/^0+|\.+$/, '')).join(' ');
// Change expression symbols from unicode to normal
const changeSymbolsToNormal = (s) => s.replace('÷', '/').replace('×', '*').replace('−', '-').replace('+', '+');
// Change expression symbols from normal to unicode
const changeSymbolsToUnicode = (s) => s.replace('/', '÷').replace('*', '×').replace('-', '−').replace('+', '+');

// Display update functions
const updateDisplayExpression = () => {
  if(calc.equalLast === true){
    calc.displayExpression.innerText = calc.expression + ' =';
  } else {
    calc.displayExpression.innerText = calc.expression;
  }
}
const updateDisplayMain = () => {
  if(!calc.num2Active) {
    calc.displayMain.innerText = calc.num1.toLocaleString(navigator.language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8
    });
  } else {
    calc.displayMain.innerText = calc.num2.toLocaleString(navigator.language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8
    });
  }
}

// Clear all displays and reset values to initial
const clearDisplay = () => {
  calc.num1 = '0';
  calc.num2 = '0';
  calc.num2Active = false;
  calc.operator = '+';
  calc.expression = '';
  calc.result = '0';
  calc.action.active = true;
  calc.equalLast = false;
  updateDisplayExpression();
  updateDisplayMain();
}

// Perform calculation based on given operator and two numbers
const calculate = (operator, num1, num2) => {
  switch(operator) {
    case '+':
      calc.result = parseFloat(num1) + parseFloat(num2);
      break;
    case '-':
      calc.result = parseFloat(num1) - parseFloat(num2);
      break;
    case '*':
      calc.result = parseFloat(num1) * parseFloat(num2);
      break;
    case '/':
      calc.result = parseFloat(num1) / parseFloat(num2);
      break;
    case '^':
      calc.result = parseFloat(num1) ** parseFloat(num2);
      break;
  }

  return calc.result;
}

// Add click listener to each input, and update Main Display
calc.inputs.forEach(element => {
  element.addEventListener('click', function() {
    if(calc.equalLast === true) {
      clearDisplay();
    }

    calc.action.active = false;
    if(!calc.num2Active) {
      if(calc.num1 == '0') {
        calc.num1 = '';
      }
      calc.num1 += this.attributes.getNamedItem('data-value').value;
    } 
    else {
      if(calc.num2 == '0') {
        calc.num2 = '';
      }
      calc.num2 += this.attributes.getNamedItem('data-value').value;
    }
    updateDisplayMain();
  });
});

// Dot button listener
calc.dot.addEventListener('click', () => {
  calc.action.active = false;
  if(!calc.num2Active) {
    if(!calc.num1.includes('.')) {
      calc.num1 += '.';
    }
  } else {
    if(!calc.num2.includes('.')) {
      calc.num2 += '.';
    }
  }
  updateDisplayMain()
});

// Add click listener to each operator, and update Expression Display
calc.action.operators.forEach(element => {
  element.addEventListener('click', function() {
    if(!calc.num2Active) {
      calc.num1 = calc.num1.replace(/\.+$/, '');
    } else {
      calc.num2 = calc.num2.replace(/\.+$/, '');
    }
  
    if(calc.action.active === true) {
      let temp_str;
      if(calc.expression == "") {
        temp_str = '0';
      }
      else {
        temp_str = calc.expression.trim().split(' ');
        temp_str.pop();
        temp_str = temp_str.join(' ');
      }
      
      if(calc.equalLast === true) {
        calc.expression = `${calc.result} ${this.attributes.getNamedItem('data-value').value} `;
        calc.equalLast = false;
        calc.num2 = '0';
      } else {
        calc.expression = `${temp_str} ${this.attributes.getNamedItem('data-value').value} `;
      }
      
      updateDisplayExpression();
    } 
    else {
      calc.expression += `${calc.num2Active ? calc.num2 : calc.num1} ${this.attributes.getNamedItem('data-value').value} `;
      updateDisplayExpression();
  
      calc.result = calculate(changeSymbolsToNormal(calc.operator), calc.num1, calc.num2);
      calc.displayMain.innerText = calc.result.toLocaleString(navigator.language, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 8
      });
      calc.num1 = String(calc.result);
      
      calc.num2 = '0';
    }
  
    // if true, indicates operator button was the last button pressed
    calc.action.active = true;

    // if true, context of input buttons pressed changes to num2
    calc.num2Active = true;

    // sets the operator
    calc.operator = this.attributes.getNamedItem('data-value').value;
  });
});

// 🡄 button
calc.backspace.addEventListener('click', () => {
  if(!calc.num2Active) {
    if(calc.num1.length > 1) {
      calc.num1 = calc.num1.substring(0, calc.num1.length-1);
    } else {
      calc.num1 = '0';
    }
  } else {
    if(calc.num2.length > 1) {
      calc.num2 = calc.num2.substring(0, calc.num2.length-1);
    } else {
      calc.num2 = '0';
    }
  }
  updateDisplayMain();
});

// = button
calc.equal.addEventListener('click', () => {
  calc.equalLast = true;

  if(calc.num2 == '0') {
    calc.num2 = calc.result;
  }

  // update expression
  calc.expression = `${calc.result} ${calc.operator} ${calc.num2}`;
  updateDisplayExpression();

  // perform calculation
  calc.result = calculate(changeSymbolsToNormal(calc.operator), calc.num1, calc.num2);
  
  // updates main display to show result
  calc.displayMain.innerText = calc.result.toLocaleString(navigator.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8
  });
  
  calc.num1 = calc.result;
  calc.action.active = true;
  calc.num2Active = true;
});

// C button
calc.clear.addEventListener('click', () => {
  clearDisplay();
});
