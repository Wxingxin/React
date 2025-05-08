//导入zustand的create 函数
import {create} from 'zustand'

//使用create函数创建useStore 的 Hook
const useStore = create<bearsType>()(()=> {
  //return 中可以存放全局共享的 数据 和 方法
  return {
    bears: 9
  }
})

//导出useStore
export default useStore