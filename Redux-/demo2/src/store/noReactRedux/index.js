import {createStore, applyMiddleware} from 'redux'
import reducer from './reducer'
//redux-thunk 这里和视频有点不一样
import {thunk} from 'redux-thunk'

//don't use thunk
// const store = createStore(reducer)

//use thunk
const store = createStore(reducer, applyMiddleware(thunk))

export default store