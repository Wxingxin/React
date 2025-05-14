import { createStore } from 'redux';

// Actions 类型
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

// Action 接口
interface IncrementAction {
  type: typeof INCREMENT;
}

interface DecrementAction {
  type: typeof DECREMENT;
}

// Action Creators 类型
export type CounterActionTypes = IncrementAction | DecrementAction;

// Action Creators
export const increment = (): IncrementAction => ({
  type: INCREMENT,
});

export const decrement = (): DecrementAction => ({
  type: DECREMENT,
});

// State 接口
export interface CounterState {
  count: number;
}

// Reducer
const initialState: CounterState = {
  count: 0,
};

function counterReducer(
  state: CounterState = initialState,
  action: CounterActionTypes
): CounterState {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

// Store
const store = createStore(counterReducer);

export default store;