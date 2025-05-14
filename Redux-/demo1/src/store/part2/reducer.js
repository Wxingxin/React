const { ADD_NUMBER, CHANGE_NAME } = require("./constants");

//create initialState
const initialState = {
  name: "wei ang gao",
  address: "shanghai",
  num: 70,
};

//create reducer
/**
 * reducer是纯函数 并且 两个参数
 * 参数1：store中目前保存state
 * 参数2：本次需要更新的action，dispatch传入的
 * 返回值：它的返回值会作为store之后存储的state
 */
function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_NAME:
      return { ...state, name: action.name };
    case ADD_NUMBER:
      return { ...state, num: state.num + action.num };
    default:
      return state
  }
}

module.exports = reducer