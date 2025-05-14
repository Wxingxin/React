const { createStore } = require("redux");

//create initialState
const initialState = {
  name: "wei ang gao",
  address: "shanghai",
  time: 70,
};

//create reducer
/**
 * reducer是纯函数 并且 两个参数
 * 参数1：store中目前保存state
 * 参数2：本次需要更新的action，dispatch传入的
 * 返回值：它的返回值会作为store之后存储的state
*/
function reducer(state = initialState, action) {
  if (action.type === "change_name") {
    return { ...state, name: action.name };
  } else if (action.type === "change_time") {
    return { ...state, time: state.time + action.num };
  } else if (action.type === 'change_address') {
    return {...state, address: action.add}
  }

  //没有新数据更新，返回之前的state
  return state;
}

//create store
const store = createStore(reducer);
module.exports = store;
