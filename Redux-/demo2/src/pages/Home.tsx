import { useState, useEffect } from 'react';
import store from '../store';
import {
  numberClicked,
  operatorClicked,
  equalsClicked,
  clearClicked,
  // CalculatorState
} from '../store/index.ts';
import { CalculatorState}  from '../store/index.ts'; // 导入 State 类型

interface CalculatorProps {} // 当前组件没有 props，可以保持为空

const Calculator: React.FC<CalculatorProps> = () => {
  const [displayValue, setDisplayValue] = useState<CalculatorState['display']>(store.getState().display);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setDisplayValue(store.getState().display);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleNumberClick = (number: string) => {
    store.dispatch(numberClicked(number));
  };

  const handleOperatorClick = (operator: string) => {
    store.dispatch(operatorClicked(operator));
  };

  const handleEqualsClick = () => {
    store.dispatch(equalsClicked());
  };

  const handleClearClick = () => {
    store.dispatch(clearClicked());
  };

  return (
    <div className="calculator">
      <div className="display">{displayValue}</div>
      <div className="buttons">
        <button onClick={handleClearClick}>C</button>
        <button onClick={() => handleOperatorClick('/')}>/</button>
        <button onClick={() => handleOperatorClick('*')}>*</button>
        <button onClick={() => handleNumberClick('7')}>7</button>
        <button onClick={() => handleNumberClick('8')}>8</button>
        <button onClick={() => handleNumberClick('9')}>9</button>
        <button onClick={() => handleOperatorClick('-')}>-</button>
        <button onClick={() => handleNumberClick('4')}>4</button>
        <button onClick={() => handleNumberClick('5')}>5</button>
        <button onClick={() => handleNumberClick('6')}>6</button>
        <button onClick={() => handleOperatorClick('+')}>+</button>
        <button onClick={() => handleNumberClick('1')}>1</button>
        <button onClick={() => handleNumberClick('2')}>2</button>
        <button onClick={() => handleNumberClick('3')}>3</button>
        <button className="equals" onClick={handleEqualsClick}>=</button>
        <button className="zero" onClick={() => handleNumberClick('0')}>0</button>
        <button onClick={() => handleNumberClick('.')}>.</button>
      </div>
    </div>
  );
};

export default Calculator;