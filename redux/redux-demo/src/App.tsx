import Home from "@/components/Home";
import Profile from "./components/Profile";
import Fish from "./components/Fish";

const App = () => {
  return (
    <div>
      <h1 onClick={() => {}}>App</h1>
      <div
        style={{
          border: "5px solid #8e44ad",
          width: "45vw",
          height: "auto",
          float: "left",
        }}
      >
        <Home></Home>
      </div>
      <div
        style={{
          border: "5px solid red",
          width: "45vw",
          height: "auto",
          float: "left",
        }}
      >
        <Profile></Profile>
      </div>
      <div
        style={{
          border: "5px solid orange",
          width: "45vw",
          height: "auto",
          float: "left",
        }}
      >
        <Fish></Fish>
      </div>
    </div>
  );
};

export default App;
