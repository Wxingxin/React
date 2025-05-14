const { createStore } = require("redux");
const reducer = require('./reducer')

//create store
const store = createStore(reducer);

module.exports = store;
