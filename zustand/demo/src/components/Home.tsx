//引入useStore
import useStore from '@/store/index.ts'

const Home = () => {
  //在需要的组件中 调用useStore
  const bears = useStore(state=> state.bears)
  return (
    <div>
      <h1>bears counte is : {bears}</h1>
    </div>
  )
}

export default Home
