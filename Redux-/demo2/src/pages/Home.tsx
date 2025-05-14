import React, { useState, useEffect, type CSSProperties } from 'react';
import store, { increment, decrement } from '../store/index';
import type { CounterState } from '../store/index';

interface CounterProps {}

const Home: React.FC<CounterProps> = () => {
  const [count, setCount] = useState<CounterState['count']>(store.getState().count);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCount(store.getState().count);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleIncrement = () => {
    store.dispatch(increment());
  };

  const handleDecrement = () => {
    store.dispatch(decrement());
  };

  return (
    <div className="counter" style={style}>
      <h1>Simple Counter (No Redux-React)</h1>
      <div className="display">Count: {count}</div>
      <div className="controls">
        <button onClick={handleIncrement}>Increment</button>
        <button onClick={handleDecrement}>Decrement</button>
      </div>
    </div>
  );
};

const style: CSSProperties = {
  border: "2px solid red",
  width: "300px",
  height: "300px",
  float: "left",
};


export default Home;