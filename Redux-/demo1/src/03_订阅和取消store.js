const store = require('./store/index')

//store subscribe function
const unSubscribe = store.subscribe(()=>{
  console.log(`store is chagne:`, store.getState())
})

const nameAction = {type: 'change_name', name: 'gao'}
store.dispatch(nameAction)
console.log(111)

const timeAction = {type: 'change_time', num: 8}
store.dispatch(timeAction)
console.log(222)


unSubscribe()

const addressAction = {type: 'change_address', add: 'zhengzhou'}
store.dispatch(addressAction)
console.log(333)
