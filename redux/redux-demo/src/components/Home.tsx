import store from "@/store";

// 在头部区域从 react-redux 中按需导入UseSelector函数：
import { useSelector } from "react-redux";

//定义ts类型
type RootState = ReturnType<typeof store.getState>;

const Home = () => {
  //使用ts 方法1
  // const count = useSelextor<>(())
  //使用ts 方法2 
  //从 main.tsx中导出ts  ，在需要的文件中引入
  //调用useSelector 使用ts 方法3
  const count = useSelector(
    (state: RootState) => state.count.value
  );
  return (
    <div>
      <h2>Home</h2>
      <div>count value is : {store.getState().count.value}</div>
      <div>
        {/* use useSelector */}
        <h3>count Value is : {count}</h3>
      </div>
    </div>
  );
};

export default Home;
