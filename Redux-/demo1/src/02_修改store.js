const store = require("./store/index");

console.log(store.getState());

//ceate action
const nameAction = { type: "change_name", name: "wei" };
store.dispatch(nameAction);
console.log(store.getState());

const timeAction = {type: 'change_time', num: 8}
store.dispatch(timeAction)
console.log(store.getState());

