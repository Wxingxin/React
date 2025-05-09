import GoatUseStore, {
  incrementGoats,
  resetGoats,
  asyncIncremenGoats,
} from "@/store/goatStore.ts";

const Goats = () => {
  const goatsState = GoatUseStore((state) => state);
  return (
    <div>
      <h2>goats count is : {goatsState.goats}</h2>
      <div>
        <button onClick={incrementGoats}>increment</button>
      </div>
      <div>
        <button onClick={resetGoats}>reset goats</button>
      </div>
      <div>
        <button onClick={asyncIncremenGoats}>async increment</button>
      </div>
    </div>
  );
};

export default Goats;
