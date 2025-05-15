import { selectCount } from "@/store/counterSlice";
import { useSelector, useDispatch } from "react-redux";

import { Button, Space } from "antd";

const Profile = () => {
  const count = useSelector(selectCount);
  //use useDispatch create dispath function
  const dispatch = useDispatch();

  //action obj
  const handleIncrement = () => {
    console.log("ok");
    dispatch({ type: "counter/increment" });
  };
  //action obj
  const handleDecrement = () => {
    console.log("de");
    dispatch({ type: "counter/decrement" });
  };

  return (
    <div>
      <h2>Profile</h2>
      <div>count value is : {count}</div>
      <Space>
        <Button type="primary" onClick={handleIncrement}>
          increment 1
        </Button>
        <Button type="primary" onClick={handleDecrement}>
          decrement 1
        </Button>
      </Space>
    </div>
  );
};

export default Profile;
