import { useState, useEffect } from "react";
import store from "../store/noReactRedux"; // 假设 store 的实现是正确的
//有4个文件，看清楚不同的函数存放的地方
import { decrement, increment } from "../store/noReactRedux/actionCreators";

const NoCounter_2 = () => {
  // 1. 初始化 count: 应该使用 getState() 并确保 count 存在
  const [count, setCount] = useState(() => {
    const currentState = store.getState();
    return currentState && currentState.count !== undefined
      ? currentState.count
      : 0; // 提供一个默认值
  });

  useEffect(() => {
    // 确保 store.subscribe 是一个函数
    if (typeof store.subscribe !== "function") {
      console.error("NoCounter_2: store.subscribe is not a function!");
      return;
    }

    const unSubscribe = store.subscribe(() => {
      // 2. 在回调中，确保从 state 对象中获取 count 值
      const currentState = store.getState();
      if (currentState && currentState.count !== undefined) {
        setCount(currentState.count);
      } else {
        // 可以选择设置一个默认值或打印错误，防止 setCount(undefined)
        console.warn(
          "NoCounter_2: count is undefined in store state after update."
        );
        setCount(0); // 或者保持上一个状态，或者处理错误
      }
    });

    // 确保 unSubscribe 是一个函数
    if (typeof unSubscribe !== "function") {
      console.error(
        "NoCounter_2: store.subscribe did not return an unsubscribe function!"
      );
      // 如果 unSubscribe 不是函数，则无法在 return 中调用它
      return;
    }

    return () => {
      unSubscribe();
    };
  }, []); // 空依赖数组，effect 只在挂载和卸载时运行

  const handleIncrement = () => {
    store.dispatch(increment());
  };
  const handleDecrement = () => {
    store.dispatch(decrement());
  };

  return (
    <div>
      <h2>NoCounter_2</h2>
      <div>count: {count}</div> {/* 这里期望 count 是一个数字 */}
      <div>
        <button onClick={handleIncrement}>increment 1</button>
        <button onClick={handleDecrement}>decrement 1</button>
      </div>
    </div>
  );
};

export default NoCounter_2;
