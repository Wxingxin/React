const store = require("./store/part2/index");
const {
  changeNameAction,
  addNumberAction,
} = require("./store/part2/actionCreators");

console.log(store.getState());

store.subscribe(() => {
  console.log("store is change:", store.getState());
});

store.dispatch(changeNameAction("gao at wei"));
store.dispatch(changeNameAction("gaolixin"));
store.dispatch(addNumberAction(8));
