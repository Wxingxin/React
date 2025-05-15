import React, { useState } from "react"; // 需要导入 useState
import { connect } from "react-redux";
import {
  changeBannersAction,
  changeRecommendsAction,
} from "../store/noReactRedux/actionCreators";
const UseReactRedux_2 = (props) => { // 接收 props
  // 从 props 中解构 Redux 相关的 state 和 dispatchers
  const { banners: reduxBanners, recommends: reduxRecommends, changeBanners, changeRecommends } = props;

  // 组件局部状态，主要用于管理API调用本身的生命周期
  // const [localFetchedData, setLocalFetchedData] = useState(null); // 如果需要本地存储完整数据
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getData() {
    setIsLoading(true);
    setError(null);
    // setLocalFetchedData(null); // 如果使用本地数据存储

    try {
      const res = await fetch("http://localhost:3000/api/articles");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} - ${res.statusText || 'Failed to fetch'}`);
      }
      const fetchedData = await res.json();
      console.log("Fetched data:", fetchedData);

      // 拿到banners并 dispatch action
      const banners = fetchedData.map((article) => article.title);
      console.log("Dispatching banners:", banners);
      changeBanners(banners); // 调用从 props 来的 dispatcher

      // 拿到recommends并 dispatch action
      const recommends = fetchedData.map((article) => article.createdAt);
      console.log("Dispatching recommends:", recommends);
      changeRecommends(recommends); // 调用从 props 来的 dispatcher

      // 如果还需要在组件本地保留完整数据
      // setLocalFetchedData(fetchedData);

    } catch (err) {
      console.error("获取数据失败:", err);
      setError(err.message || "获取数据失败");
    } finally {
      setIsLoading(false); // 确保 isLoading 状态被重置
    }
  }

  return (
    <div>
      <h2>UseReactRedux_2 - Data Fetcher</h2>
      <button onClick={getData} disabled={isLoading}>
        {isLoading ? "Loading..." : "Get Data"}
      </button>
    </div>
  );
};

// 映射state到props
const mapStateToProps = (state) => ({
  banners: state.banners,
  recommends: state.recommends,
});

// 映射dispatch到props
const mapDispatchToProps = (dispatch) => ({
  changeBanners: (banners) => dispatch(changeBannersAction(banners)),
  changeRecommends: (recommends) => dispatch(changeRecommendsAction(recommends)), // <--- 修正拼写
});

// 使用connect高阶组件连接组件
export default connect(mapStateToProps, mapDispatchToProps)(UseReactRedux_2);
