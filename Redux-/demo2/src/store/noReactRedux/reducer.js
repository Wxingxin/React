import * as actionType from './constants'


const initialState = {
  count: 6,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.INCREMENT:
      return { ...state, count: state.count + action.num };
    case actionType.DECREMENT:
      return { ...state, count: state.count - action.num };
    default:
      return state;
  }
};

export default reducer;
