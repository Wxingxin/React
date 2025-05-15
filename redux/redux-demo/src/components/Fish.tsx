import fishSlice  from "@/store/fishSlice";
import { useSelector, useDispatch } from "react-redux";
import { Button, Space } from "antd";

import {incrementFish, decrementFish} from '@/store/fishSlice'

const Fish = () => {
  // const fish = useSelector(fishSlice)
  const dispatch = useDispatch()

  const handleIncrement = ()=> {
    dispatch(incrementFish())
  }

  const handleDecrement = () => {
    dispatch(decrementFish())
  }
  
  return (
    <div>
      <h2>Fish</h2>
      <Space>
        <Button type='primary'>+ 1</Button>
        <Button type="primary">- 1</Button>
      </Space>
    </div>
  )
}

export default Fish
