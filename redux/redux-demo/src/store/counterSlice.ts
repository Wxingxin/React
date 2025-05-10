// 1. 导入 createSlice 函数，用来创建切片
import { createSlice } from '@reduxjs/toolkit'


// 2. 调用 createSlice 函数创建切片
// 必须提供 name, initialState, reducers 这三个配置选项
const counterSlice = createSlice({
  // 切片的唯一标识符
  name: 'counter',
  // 初始的 state 数据
  initialState: {
    value: 9
  },
  // reducers 函数，用来描述如何更新 state 数据
  reducers: {
    
  }
})


// 3. 向外默认导出当前 slice 切片生成的 reducer 函数
export default counterSlice.reducer