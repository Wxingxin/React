import { createStore } from 'redux';

// Actions 类型
export const NUMBER_CLICKED = 'NUMBER_CLICKED';
export const OPERATOR_CLICKED = 'OPERATOR_CLICKED';
export const EQUALS_CLICKED = 'EQUALS_CLICKED';
export const CLEAR_CLICKED = 'CLEAR_CLICKED';

// Action 接口
interface NumberClickedAction {
  type: typeof NUMBER_CLICKED;
  payload: string;
}

interface OperatorClickedAction {
  type: typeof OPERATOR_CLICKED;
  payload: string;
}

interface EqualsClickedAction {
  type: typeof EQUALS_CLICKED;
}

interface ClearClickedAction {
  type: typeof CLEAR_CLICKED;
}

// Action Creators 类型
export type CalculatorActionTypes =
  | NumberClickedAction
  | OperatorClickedAction
  | EqualsClickedAction
  | ClearClickedAction;

// Action Creators
export const numberClicked = (number: string): NumberClickedAction => ({
  type: NUMBER_CLICKED,
  payload: number,
});

export const operatorClicked = (operator: string): OperatorClickedAction => ({
  type: OPERATOR_CLICKED,
  payload: operator,
});

export const equalsClicked = (): EqualsClickedAction => ({
  type: EQUALS_CLICKED,
});

export const clearClicked = (): ClearClickedAction => ({
  type: CLEAR_CLICKED,
});

// State 接口
interface CalculatorState {
  display: string;
  firstOperand: number | null;
  secondOperand: number | null;
  operator: string | null;
}

// Reducer
const initialState: CalculatorState = {
  display: '0',
  firstOperand: null,
  secondOperand: null,
  operator: null,
};

function calculatorReducer(
  state: CalculatorState = initialState,
  action: CalculatorActionTypes
): CalculatorState {
  switch (action.type) {
    case NUMBER_CLICKED:
      return {
        ...state,
        display: state.display === '0' ? action.payload : state.display + action.payload,
      };
    case OPERATOR_CLICKED:
      return {
        ...state,
        firstOperand: parseFloat(state.display),
        operator: action.payload,
        display: '0',
      };
    case EQUALS_CLICKED:
      if (state.firstOperand !== null && state.operator && state.display !== '0') {
        const secondOperand = parseFloat(state.display);
        let result: number;
        switch (state.operator) {
          case '+':
            result = state.firstOperand + secondOperand;
            break;
          case '-':
            result = state.firstOperand - secondOperand;
            break;
          case '*':
            result = state.firstOperand * secondOperand;
            break;
          case '/':
            result = state.firstOperand / secondOperand;
            break;
          default:
            return state;
        }
        return {
          ...state,
          display: String(result),
          firstOperand: null,
          secondOperand: null,
          operator: null,
        };
      }
      return state;
    case CLEAR_CLICKED:
      return initialState;
    default:
      return state;
  }
}

// Store
const store = createStore(calculatorReducer);

export default store;