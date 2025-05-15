import NoCounter_1 from "./components/NoCounter_1";
import NoCounter_2 from "./components/NoCounter_2";
import UseReactRedux_1 from "./components/UseReactRedux_1";
import UseReactRedux_2 from "./components/UseReactRedux_2";
import UseFetch from "./components/UseFetch";

const App = () => {
  return (
    <div>
      <h1>App page</h1>
      <div
        style={{
          border: "5px solid red",
          width: "45vw",
          height: "auto",
          float: "left",
        }}
      >
        <NoCounter_1 />
      </div>
      <div
        style={{
          border: "5px solid green",
          width: "45vw",
          height: "auto",
          float: "left",
        }}
      >
        <NoCounter_2 />
      </div>
      <hr />
      <div
        style={{
          border: "5px solid orange",
          width: "45vw",
          height: "auto",
          float: "left",
        }}
      >
        <UseReactRedux_1 />
      </div>
      <div
        style={{
          border: "5px solid blue",
          width: "45vw",
          height: "auto",
          float: "left",
        }}
      >
        <UseReactRedux_2 />
      </div>
      <div
        style={{
          border: "5px solid #8e44ad",
          width: "45vw",
          height: "auto",
          float: "left",
        }}
      >
        <UseFetch />
      </div>
    </div>
  );
};
export default App;
