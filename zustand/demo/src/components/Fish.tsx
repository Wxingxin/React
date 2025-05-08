import fishUseStore from "@/store/fishStore";

const Fish = () => {
  const fishState = fishUseStore((state) => state);
  return (
    <div>
      <h1>Fish</h1>
      <div>fish count is : {fishState.fish}</div>
      <div>
        <button onClick={fishState.incrementFish}>increment fish</button>
      </div>
      <div>
        <button onClick={fishState.resetFish}>reset fish</button>
      </div>
      <div>
        <button onClick={fishState.asyncIncrementFish}>async increment fish</button>
      </div>
    </div>
  );
};

export default Fish;
