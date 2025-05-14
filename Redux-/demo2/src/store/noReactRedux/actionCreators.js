import * as actionType from "./constants";

// action创建函数
export const increment = (num) => ({ type: actionType.INCREMENT, num });
export const decrement = (num) => ({ type: actionType.DECREMENT, num });
