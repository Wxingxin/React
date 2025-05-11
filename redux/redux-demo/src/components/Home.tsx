import store from "@/store";

// 在头部区域从 react-redux 中按需导入UseSelector函数：
import { useSelector } from "react-redux";

//定义ts类型
type RootState = ReturnType<typeof store.getState>;

const Home = () => {
  //调用useSelector
  const count = useSelector((state: RootState) => state.count.value);
  return (
    <div>
      <h2>Home</h2>
      <div>count value is : {store.getState().count.value}</div>
      <div>
        <h3>count Value is : {count}</h3>
      </div>
    </div>
  );
};

export default Home;
