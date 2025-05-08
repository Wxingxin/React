//引入useStore
import useStore from "@/store/index.ts";

const Home = () => {
  //在需要的组件中 调用useStore
  const bears = useStore((state) => state.bears);

  const BearsIs88 = useStore((state) => state.BearsIs88);
  const incrementBears = useStore((state) => state.incrementBears);
  const resetBears = useStore((state) => state.resetBears);
  const stepBears = useStore((state) => state.stepBears);
  const asyncIncrementBears = useStore((state) => state.asyncIncrementBears);
  return (
    <div>
      <h1>bears counte is : {bears}</h1>
      <div>
        <button onClick={BearsIs88}>bears is 88</button>
      </div>
      <div>
        <button onClick={incrementBears}>increment</button>
      </div>
      <div>
        <button onClick={resetBears}>reset bears</button>
      </div>
      <div>
        <button onClick={() => stepBears(5)}>step bears 5</button>
      </div>
      <div>
        <button onClick={asyncIncrementBears}>async 1s add bears</button>
      </div>
      <Fish></Fish>
    </div>
  );
};

export default Home;

const Fish = () => {
  const fishState = useStore((state) => state);
  return (
    <div>
      <h2>fish count: {fishState.fish}</h2>
      <div>
        <button onClick={fishState.incrementFish}>increment fish</button>
      </div>
    </div>
  );
};
