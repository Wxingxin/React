// 导入redux 的核心函数
import {configureStore} from '@reduxjs/toolkit'

//导入reducer的切片
import counterReducer from '@/store/counterSlice'

//create store
const store = configureStore({
  //redux 用来描述如何变更store中的数据
  reducer: {
    //挂载reducer函数
    count: counterReducer
  }
})

//export store
export default store