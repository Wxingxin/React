import * as actionType from "./constants";

const initialState = {
  count: 6,
  banners: [],
  recommends: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.INCREMENT:
      return { ...state, count: state.count + action.num };
    case actionType.DECREMENT:
      return { ...state, count: state.count - action.num };
    case actionType.CHANGE_BANNERS:
      return { ...state, banners: action.banners };
    case actionType.CHAGNE_RECOMMENDS:
      return { ...state, recommends: action.recommends };
    default:
      return state;
  }
};

export default reducer;
