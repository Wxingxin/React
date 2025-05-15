import * as actionType from "./constants";

// action创建函数
export const increment = (num) => ({ type: actionType.INCREMENT, num });
export const decrement = (num) => ({ type: actionType.DECREMENT, num });

export const changeBannersAction = (banners) => ({
  type: actionType.CHANGE_BANNERS,
  banners,
});
export const changeRecommendsAction = (recommends) => ({
  type: actionType.CHAGNE_RECOMMENDS,
  recommends,
});

export const fetchHomeMultidataAction = () => {
  async function getData() {
    const res = await fetch("http://localhost:3000/api/articles");

    const fetchedData = await res.json();

    // 拿到banners并 dispatch action
    const banners = fetchedData.map((article) => article.title);
    changeBanners(banners); // 调用从 props 来的 dispatcher

    // 拿到recommends并 dispatch action
    const recommends = fetchedData.map((article) => article.createdAt);
    changeRecommends(recommends); // 调用从 props 来的 dispatcher
  }
  return getData;
};
