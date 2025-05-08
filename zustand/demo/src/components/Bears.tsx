import bearsUseStore from "@/store/bearsStore";

const Bears = () => {
  const bearsStore = bearsUseStore((state) => state);
  return (
    <div>
      <h1>bears counte is : {bearsStore.bears}</h1>
      <div>
        <button onClick={bearsStore.BearsIs88}>bears is 88</button>
      </div>
      <div>
        <button onClick={bearsStore.incrementBears}>increment</button>
      </div>
      <div>
        <button onClick={bearsStore.resetBears}>reset bears</button>
      </div>
      <div>
        <button onClick={() => bearsStore.stepBears(5)}>step bears 5</button>
      </div>
      <div>
        <button onClick={bearsStore.asyncIncrementBears}>
          async 1s add bears
        </button>
      </div>
    </div>
  );
};

export default Bears;
