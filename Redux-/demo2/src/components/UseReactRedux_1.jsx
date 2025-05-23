import { connect } from "react-redux";
import {
  increment,
  decrement,
  changeBannersAction,
  changeRecommendsAction,
} from "../store/noReactRedux/actionCreators.js";

const UseReactRedux_1 = ({
  count,
  banners,
  recommends,
  increment,
  decrement,
}) => {
  return (
    <div>
      <h2>UseReactRedux_1</h2>
      <div>count: {count}</div>
      <div>
        <button onClick={increment}>increment 3</button>
        <button onClick={decrement}>decrement 3</button>
      </div>
      <div>
        <h4>轮播数据</h4>
        <ul>
          {/* bannerItem 本身就是title 不需要再 bannersItem.title */}
          {banners.map((bannersItem, index) => (
            <li key={index}>{bannersItem}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>推荐数据</h4>
        <ul>
          {recommends.map((recommendsTitle, index) => (
            <li key={index}>{recommendsTitle}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 映射state到props
const mapStateToProps = (state) => ({
  count: state.count,
  banners: state.banners,
  recommends: state.recommends,
});

// 映射dispatch到props
const mapDispatchToProps = (dispatch) => ({
  //接受方法
  increment: () => dispatch(increment(10)),
  decrement: () => dispatch(decrement(10)),
});

// 使用connect高阶组件连接组件
export default connect(mapStateToProps, mapDispatchToProps)(UseReactRedux_1);
