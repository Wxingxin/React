### Redux 中 dispatch 的基本使用方法

在 Redux 中，**dispatch** 是触发状态变化的核心机制。它通过发送 **action** 到 **store**，通知 reducer 更新状态。以下是 dispatch 的基本使用方法和常见场景：


### **1. 基本概念**
- **作用**：触发状态更新的唯一方式
- **语法**：`store.dispatch(action)`
- **参数**：必须是一个包含 `type` 字段的普通对象（同步 action），或一个函数（异步 action，需配合中间件如 `redux-thunk`）


### **2. 同步 Dispatch**
#### **直接 Dispatch 对象**
```typescript
// 同步 action 对象
const incrementAction = {
  type: 'INCREMENT',
  payload: 1
};

// 直接 dispatch action
store.dispatch(incrementAction);
```

#### **使用 Action Creator**
```typescript
// Action Creator：返回 action 对象的函数
const increment = (amount) => ({
  type: 'INCREMENT',
  payload: amount
});

// 通过 action creator 生成 action 并 dispatch
store.dispatch(increment(1));
```


### **3. 在 React 组件中使用 Dispatch**
#### **方式一：使用 `useDispatch` Hook（推荐）**
```tsx
import { useDispatch } from 'react-redux';
import { increment } from './actions';

function Counter() {
  const dispatch = useDispatch(); // 获取 dispatch 函数

  return (
    <button onClick={() => dispatch(increment(1))}>
      增加计数
    </button>
  );
}
```

#### **方式二：使用 `connect` 高阶组件（旧方式）**
```tsx
import { connect } from 'react-redux';
import { increment } from './actions';

function Counter({ increment }) {
  return (
    <button onClick={() => increment(1)}>
      增加计数
    </button>
  );
}

// 将 dispatch 绑定到 props
const mapDispatchToProps = {
  increment // 等价于 increment: increment
};

export default connect(null, mapDispatchToProps)(Counter);
```


### **4. 异步 Dispatch（使用中间件）**
#### **Redux Thunk**
```bash
npm install redux-thunk
```

```typescript
// 配置 store 时启用 thunk 中间件
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);
```

```typescript
// 异步 action creator（返回函数而非对象）
export const fetchUser = (userId) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_USER_REQUEST' });
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_USER_FAILURE', payload: error.message });
    }
  };
};
```

```tsx
// 在组件中 dispatch 异步 action
import { useDispatch } from 'react-redux';
import { fetchUser } from './actions';

function UserComponent() {
  const dispatch = useDispatch();
  
  return (
    <button onClick={() => dispatch(fetchUser(1))}>
      加载用户
    </button>
  );
}
```


### **5. 使用 Redux Toolkit 简化 Dispatch**
RTK 的 `createAsyncThunk` 自动处理异步流程：

```typescript
// features/usersSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// 创建异步 thunk
export const fetchUser = createAsyncThunk(
  'users/fetchById',
  async (userId) => {
    const response = await axios.get(`/api/users/${userId}`);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: { entities: [], loading: 'idle' },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.entities.push(action.payload);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
```

```tsx
// 在组件中直接 dispatch
import { useDispatch } from 'react-redux';
import { fetchUser } from './features/usersSlice';

function UserComponent() {
  const dispatch = useDispatch();
  
  return (
    <button onClick={() => dispatch(fetchUser(1))}>
      加载用户
    </button>
  );
}
```


### **6. 链式 Dispatch 多个 Action**
```tsx
const dispatch = useDispatch();

// 按顺序 dispatch 多个 action
const handleSubmit = () => {
  dispatch({ type: 'FORM_SUBMIT_START' });
  
  api.submitForm(data)
    .then(() => dispatch({ type: 'FORM_SUBMIT_SUCCESS' }))
    .catch((error) => dispatch({ type: 'FORM_SUBMIT_ERROR', payload: error }));
};
```


### **关键总结**
1. **同步 Dispatch**：直接发送包含 `type` 的对象
2. **异步 Dispatch**：需要中间件（如 `redux-thunk`、`redux-saga`）支持
3. **推荐使用 Redux Toolkit**：`createAsyncThunk` 简化异步流程
4. **在组件中获取 Dispatch**：
   - 函数组件：使用 `useDispatch()`
   - 类组件：使用 `connect()` 高阶组件
5. **错误处理**：在异步 action 中添加错误捕获逻辑

通过合理使用 dispatch，你可以构建出可预测、易于调试的状态管理流程。