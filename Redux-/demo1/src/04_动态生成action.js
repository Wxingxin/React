const store = require('./store/index')

const unSubscribe = store.subscribe(()=> {
  console.log('store is change :', store.getState())
})

const change_nameAction = (name) => {
  return {
    type: 'change_name',
    name
  }
}

const change_addressAction = (address) => {
  return {
    type: 'change_address',
    address
  }
}

store.dispatch(change_nameAction('wei'))
store.dispatch(change_addressAction('nn'))
unSubscribe()
store.dispatch(change_nameAction('gaolixin'))
