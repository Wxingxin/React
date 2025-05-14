const {createStore} = require('redux')

//create initialState
const initialState = {
  name: 'wei ang gao',
  address: 'shanghai'
}

//create reducer
function reducer() {
  return initialState
}

//create store
const store = createStore(reducer)
module.exports = store