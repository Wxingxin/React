# useContext 最基础的使用流程

**目标：** 在一个嵌套较深的组件中，显示顶层组件定义的用户名，而不需要中间组件手动传递 props。

**步骤：**

1.  **创建 Context**：定义一个共享数据的“容器”。
1.  **提供 Context (Provider)** ：在父组件中，指定要共享的数据，并包裹住需要访问这些数据的子组件。
1.  **消费 Context (useContext)** ：在需要数据的子组件中，使用 useContext Hook 来获取数据。

---

**代码示例：**

#### **第 1 步：创建 Context 对象**

在你的项目中创建一个文件（例如 src/contexts/UserContext.js）来存放 Context 对象。

```js
// src/contexts/UserContext.js
import React from "react";

// 创建一个 Context 对象
// '游客' 是默认值，只有在没有找到 Provider 时才会使用
const UserContext = React.createContext("游客");

export default UserContext;
```

#### **第 2 步：在父组件中使用 Provider 提供值**

在你的应用顶层或某个合适的父组件（例如 App.js）中，导入 UserContext，并使用 UserContext.Provider 来包裹子组件，通过 value prop 提供你想共享的数据。

```js
// src/App.js
import React from "react";
import UserContext from "./contexts/UserContext"; // 导入 Context
import HomePage from "./components/HomePage"; // 导入子组件

function App() {
  const loggedInUser = "张三"; // 这是我们想要共享的数据

  return (
    // 使用 Provider 包裹子组件
    // 通过 'value' prop 提供要共享的值
    <UserContext.Provider value={loggedInUser}>
      <div>
        <h1>欢迎来到我的应用</h1>
        <HomePage /> {/* HomePage 及其所有子孙组件现在都可以访问 UserContext */}
      </div>
    </UserContext.Provider>
  );
}

export default App;
```

#### **第 3 步：在需要数据的子/孙组件中使用 useContext 消费值**

假设 HomePage 组件渲染了另一个组件 Header，而 Header 组件需要显示用户名。

```js
// src/components/HomePage.js
import React from "react";
import Header from "./Header";

function HomePage() {
  // HomePage 组件本身可能不需要用户名
  // 它只是渲染了需要用户名的 Header
  return (
    <div>
      <h2>首页</h2>
      <Header />
      {/* 其他首页内容 */}
    </div>
  );
}

export default HomePage;
```

现在，在 Header 组件中，我们可以使用 useContext 来获取 App 组件提供的用户名。

```js
// src/components/Header.js
import React, { useContext } from "react"; // 导入 useContext Hook
import UserContext from "../contexts/UserContext"; // 导入我们创建的 Context 对象

function Header() {
  // 调用 useContext 并传入 Context 对象
  // 它会返回 Provider 提供的 'value' 值 ("张三")
  const username = useContext(UserContext);

  return (
    <header
      style={{ background: "#eee", padding: "10px", marginBottom: "10px" }}
    >
      <span>Logo</span>
      <span style={{ float: "right" }}>
        当前用户: **{username}** {/* 直接使用获取到的值 */}
      </span>
    </header>
  );
}

export default Header;
```

**运行结果：**

页面会显示 "欢迎来到我的应用"，然后是 "首页" 标题，最后在 Header 组件中显示 "当前用户: **张三**"。

**解释：**

1.  我们创建了 UserContext。
1.  App 组件作为 Provider，将字符串 "张三" 作为 value 提供了出去。
1.  HomePage 组件位于 Provider 的内部，但它本身没有使用 UserContext。
1.  Header 组件也位于 Provider 内部。它调用 useContext(UserContext)，React 向上查找组件树，找到了最近的 UserContext.Provider，并获取了它的 value 值（即 "张三"），然后将其赋值给 username 变量。
1.  这样，Header 组件就成功获取了来自 App 组件的数据，而无需 HomePage 进行任何 props 传递。

这就是 useContext 最基础的使用方法，它有效地避免了“道具钻孔”（Props Drilling）的问题。

好的，useContext 的嵌套使用非常常见，它允许你在一个组件中同时消费（访问）来自**不同 Context Provider** 的值。这对于组合不同的全局或区域状态（如主题、用户认证、语言设置等）非常有用。

**核心思想：**

1.  **嵌套 Provider：** 在你的组件树中，你可以将不同的 Context.Provider 组件相互嵌套。
1.  **多次调用 useContext：** 在需要访问多个 Context 的子组件中，你只需为每个想访问的 Context **分别调用一次 useContext Hook**，并传入对应的 Context 对象。

**场景：**

假设我们有一个应用，同时需要管理：

- **主题 (Theme):** light 或 dark 模式。
- **用户认证 (Auth):** 当前登录的用户信息。

我们希望某个组件（比如用户个人资料卡片）能够根据当前主题显示样式，并且显示当前登录用户的名字。

**步骤：**

1.  **创建多个 Context 对象**：分别为主题和认证创建 Context。
1.  **嵌套 Provider 提供值**：在顶层组件中，嵌套使用 ThemeContext.Provider 和 AuthContext.Provider。
1.  **在子组件中多次调用 useContext**：在需要同时访问主题和用户信息的组件中，分别调用 useContext(ThemeContext) 和 useContext(AuthContext)。

---

**代码示例：**

#### **第 1 步：创建多个 Context 对象**

```js
// src/contexts/ThemeContext.js
import React from "react";
export const ThemeContext = React.createContext({
  theme: "light", // 默认值对象
  toggleTheme: () => {}, // 默认空函数
});

// src/contexts/AuthContext.js
import React from "react";
export const AuthContext = React.createContext({
  user: null, // 默认用户未登录
  login: () => {},
  logout: () => {},
});
```

注意：这里我们为 Context 提供了包含默认值和空函数的对象作为默认值，这样即使没有 Provider，代码也不会因访问 undefined 的属性而出错，并且有助于类型提示和自动补全。

#### **第 2 步：嵌套 Provider 提供值**

在 App.js 或其他合适的父组件中，管理状态并嵌套 Provider。

```js
// src/App.js
import React, { useState, useCallback } from "react";
import { ThemeContext } from "./contexts/ThemeContext";
import { AuthContext } from "./contexts/AuthContext";
import UserProfileCard from "./components/UserProfileCard"; // 稍后创建这个组件

function App() {
  // 主题状态管理
  const [theme, setTheme] = useState("light");
  const toggleTheme = useCallback(() => {
    // 使用 useCallback 避免不必要的函数引用变化
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // 认证状态管理
  const [user, setUser] = useState(null); // 初始未登录
  const login = useCallback((username) => {
    // 模拟登录
    setUser({ name: username });
  }, []);
  const logout = useCallback(() => {
    // 模拟登出
    setUser(null);
  }, []);

  // 创建传递给 Provider 的 value 对象 (推荐使用 useMemo 或 useCallback 保证引用稳定)
  const themeContextValue = { theme, toggleTheme };
  const authContextValue = { user, login, logout };

  // **嵌套 Provider**
  // ThemeProvider 包裹 AuthProvider (顺序通常不重要，除非一个依赖另一个)
  return (
    <ThemeContext.Provider value={themeContextValue}>
      <AuthContext.Provider value={authContextValue}>
        <div
          style={{
            minHeight: "100vh",
            background: theme === "light" ? "#FFF" : "#222",
            color: theme === "light" ? "#000" : "#FFF",
            padding: "20px",
          }}
        >
          <h1>嵌套 Context 示例</h1>
          <UserProfileCard />
          <hr />
          {/* 控制按钮 */}
          <button onClick={toggleTheme}>切换主题</button>
          {!user ? (
            <button onClick={() => login("Alice")}>模拟登录 (Alice)</button>
          ) : (
            <button onClick={logout}>模拟登出</button>
          )}
        </div>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
```

注意：我们使用了 useCallback 来确保传递给 value 的函数引用是稳定的，这有助于性能优化，防止因为函数引用每次都变化而导致消费者不必要的重渲染。对于包含多个值的 value 对象，也可以使用 useMemo 进一步优化。

#### **第 3 步：在子组件中消费多个 Context**

现在，在 UserProfileCard 组件中，我们需要同时访问主题和用户信息。

```js
// src/components/UserProfileCard.js
import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext"; // 导入 ThemeContext
import { AuthContext } from "../contexts/AuthContext"; // 导入 AuthContext

function UserProfileCard() {
  // **分别调用 useContext 获取不同 Context 的值**
  const { theme } = useContext(ThemeContext); // 获取主题信息
  const { user, logout } = useContext(AuthContext); // 获取用户信息和登出函数

  // 根据主题设置卡片样式
  const cardStyle = {
    border: `2px solid ${theme === "light" ? "#ccc" : "#666"}`,
    backgroundColor: theme === "light" ? "#f9f9f9" : "#444",
    padding: "15px",
    margin: "15px 0",
    borderRadius: "8px",
    color: theme === "light" ? "#333" : "#eee", // 确保文字颜色与背景对比
  };

  return (
    <div style={cardStyle}>
      <h3>用户资料卡片</h3>
      {user ? (
        <div>
          <p>姓名: {user.name}</p>
          <p>当前主题: {theme}</p>
          <button onClick={logout} style={{ marginTop: "10px" }}>
            登出 (来自卡片)
          </button>
        </div>
      ) : (
        <p>请先登录。</p>
      )}
    </div>
  );
}

export default UserProfileCard;
```

**运行结果和解释：**

1.  页面加载时，显示浅色背景（默认主题），卡片中显示 "请先登录。"

1.  点击 "切换主题" 按钮：

    - App 组件的 theme state 改变。
    - ThemeContext.Provider 的 value 改变。
    - UserProfileCard 因为消费了 ThemeContext 而重新渲染，卡片样式会根据新的 theme 值更新（背景、边框、文字颜色变化）。

1.  点击 "模拟登录 (Alice)" 按钮：

    - App 组件的 user state 改变。
    - AuthContext.Provider 的 value 改变。
    - UserProfileCard 因为消费了 AuthContext 而重新渲染，卡片中会显示 "姓名: Alice" 和登出按钮。

1.  再次点击 "切换主题"：卡片样式会变，但用户姓名（来自 AuthContext）保持不变。

1.  点击 "登出" 按钮（无论是 App 级还是卡片里的）：

    - App 组件的 user state 变回 null。
    - AuthContext.Provider 的 value 改变。
    - UserProfileCard 重新渲染，显示 "请先登录。"

**总结：**

- 嵌套 useContext 非常简单，只需将 Provider 嵌套放置，并在消费组件中为每个需要的 Context 调用 useContext。
- 每个 useContext 调用都独立地从组件树向上查找最近的、匹配的 Provider。
- 这种模式有助于按功能组织和分离全局状态，使得代码更清晰、更模块化。
- 仍然需要注意性能问题，确保传递给 Provider 的 value prop 的引用稳定性（使用 useState, useCallback, useMemo）。
- 当 Context 嵌套和消费变得复杂时，可以考虑创建自定义 Hook（如 useTheme()，useAuth()）来封装 useContext 的调用，使消费组件的代码更简洁。

| `知识点`          | `内容`                                                                       |
| ----------------- | ---------------------------------------------------------------------------- |
| 创建 Context      | `const MyContext = createContext(defaultValue)`                              |
| Provider 提供数据 | `<MyContext.Provider value={xxx}>...</MyContext.Provider>`                   |
| 消费 Context      | `const value = useContext(MyContext)`                                        |
| 触发更新          | 如果 Provider 的 value 变化，所有用 useContext 的组件会自动重新渲染          |
| 多个 Context      | 可以同时用多个 `useContext`，不冲突                                          |
| 注意性能          | 如果 value 是对象，变化时最好使用 `useMemo` 包一层，减少无意义的子组件重渲染 |

| `注意点`                                                          | `解释`                                                                 |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 只能在函数组件或自定义 Hook 中用                                  | `useContext` 只能在**组件顶层**调用，不能在 if/for/内部函数中用。      |
| 每次 Provider 的 value 变，都会引起用到 useContext 的组件重新渲染 | 即使 value 是对象或数组，哪怕对象内容没变，只要引用变了也会重新渲染。  |
| 建议对复杂 value 使用 useMemo                                     | 这样可以减少无意义的渲染。                                             |
| 适合轻量全局状态                                                  | 如果数据量大、变化频繁，用 Redux、Zustand 这类更专业的状态管理更合适。 |

# React useReducer Hook 的所有关键知识点。

#### **1. 核心概念与目的**

- **useReducer 是什么？** 它是 React 提供的一个内置 Hook，作为 useState 的一种替代方案。
- **目的：** 用于管理**更复杂**的组件状态逻辑。当状态逻辑涉及多个子值，或者下一个状态依赖于前一个状态时，useReducer 通常比 useState 更合适。它借鉴了 Redux 等状态管理库中的 reducer 模式。
- **核心思想：** 将**状态更新的逻辑**（如何根据发生的事件或动作来改变状态）从组件内部抽离到一个独立的 **reducer 函数**中。组件通过**分发 (dispatch) action 对象**来表达“想要做什么”，而不是直接指定新的状态值。

#### **2. 基本语法**

```js
import React, { useReducer } from 'react';

const [state, dispatch] = useReducer(reducer, initialState, init?);

```

- **reducer (函数):** 必需。一个纯函数，接收当前 state 和一个 action 对象作为参数，并返回**新的 state**。 (state, action) => newState。

- **initialState:** 必需。状态的初始值。可以是任何类型的值（对象、数组、字符串、数字等）。

- **init (可选函数):** 用于惰性初始化 (Lazy Initialization)。如果提供，初始 state 将被设置为 init(initialState)。这允许你将计算初始状态的逻辑提取出来，或者在初始状态依赖于 props 时进行重置。

- **返回值:**

  - state: 当前的状态值。
  - dispatch: 一个**分发函数**。你调用 dispatch(action) 来触发状态更新。React 会将当前的 state 和你提供的 action 传递给你的 reducer 函数，并将 reducer 返回的新状态设置为组件的当前状态，然后触发重新渲染。

#### **3. reducer 函数详解**

- **纯函数 (Pure Function):** 这是 reducer 的**核心要求**。

  - 给定相同的输入（state 和 action），必须始终返回相同的输出（newState）。
  - 不能有副作用（如发起 API 请求、修改 DOM、设置定时器、修改传入的 state 或 action 对象等）。
  - **不能直接修改 (mutate) state 参数！** 必须返回一个全新的状态对象或值。如果状态没有变化，可以直接返回原始的 state。

- **参数：**

  - state: 当前的状态值。
  - action: 通常是一个包含 type 属性（描述操作类型，通常是字符串常量）和可选 payload 属性（携带执行操作所需的数据）的对象。例如：{ type: 'INCREMENT', payload: 1 } 或 { type: 'SET_USER', payload: { id: 1, name: 'Alice' } }。

- **实现方式：** 通常使用 switch 语句根据 action.type 来决定如何计算并返回新的状态。

```js
// 示例 reducer 函数
function counterReducer(state, action) {
  console.log("Reducer called with state:", state, "and action:", action);
  switch (action.type) {
    case "INCREMENT":
      // 返回一个全新的对象，而不是修改 state.count
      return { ...state, count: state.count + (action.payload || 1) };
    case "DECREMENT":
      return { ...state, count: state.count - (action.payload || 1) };
    case "RESET":
      return { ...state, count: action.payload }; // 使用 payload 作为新的 count 值
    case "SET_STATUS":
      return { ...state, status: action.payload };
    default:
      // 对于未知的 action 类型，通常抛出错误或返回原 state
      // throw new Error(`Unhandled action type: ${action.type}`);
      return state; // 或者直接返回原 state
  }
}
```

#### **4. dispatch 函数详解**

- **目的：** 在组件内部触发状态更新的**唯一**方式。

- **参数：** 接收一个 action 对象，这个对象会被传递给 reducer 函数。

- **行为：** 调用 dispatch(action) 时：

  1.  React 将当前 state 和这个 action 发送给 reducer 函数。
  1.  reducer 函数计算并返回 newState。
  1.  React 存储这个 newState，并安排一次组件重新渲染。

- **身份稳定性：** React **保证** dispatch 函数的身份在组件的整个生命周期内是**稳定**的。这意味着你可以安全地将其作为依赖项传递给 useEffect、useCallback 等，而不会导致不必要的重复执行（通常可以省略它作为依赖）。

#### **5. initialState 与惰性初始化 (init 函数)**

- **简单初始值：** useReducer(reducer, { count: 0, status: 'idle' })

- **惰性初始化：** 当初始状态的计算比较复杂或耗时时使用。

  ```js
  function createInitialState(initialCount) {
    console.log("计算初始状态..."); // 只会执行一次
    // 假设这里有复杂逻辑
    return { count: initialCount, status: "idle" };
  }

  function MyComponent({ startCount }) {
    // 第三个参数是 init 函数，第二个参数是传递给 init 函数的参数
    const [state, dispatch] = useReducer(
      counterReducer,
      startCount,
      createInitialState
    );
    // ...
  }
  ```

  在这种情况下，createInitialState 只会在组件**首次渲染**时被调用一次，startCount 会作为参数传递给它。

#### **6. 何时使用 useReducer？ (vs useState)**

- **状态逻辑复杂：** 当你有多个状态值需要协同工作，或者下一个状态严重依赖于前一个状态时。
- **状态更新方式多样：** 当一个状态可以通过多种不同的“动作”来更新时。
- **状态逻辑需要解耦/测试：** Reducer 是纯函数，易于单独测试，不依赖 React 组件本身。
- **深层组件更新状态：** 将 dispatch 函数通过 props 或 Context 传递下去通常比传递多个 setState 回调更方便和高效（因为 dispatch 身份稳定）。
- **性能优化：** 在某些情况下，当子组件只需要 dispatch 而不需要 state 时，可以避免因 state 变化导致的不必要重渲染（通过 React.memo 和传递 dispatch）。
- **代码可读性与可维护性：** 将更新逻辑集中在 reducer 中可以使组件代码更专注于渲染和事件处理。

#### **7. 优点总结**

- **集中化状态逻辑：** 易于理解和维护。
- **可预测性：** 纯函数 reducer 使得状态变化更可预测。
- **可测试性：** Reducer 可以独立于 UI 进行测试。
- **改进的调试：** 可以在 reducer 中轻松打印日志，追踪 state 和 action。
- **性能优化潜力：** 稳定的 dispatch 函数。
- **与 useContext 结合强大：** 实现全局或区域状态管理的有效方式。

#### **8. 缺点/注意事项**

- **代码量增加：** 对于简单的状态，比 useState 需要写更多代码（定义 reducer、action 类型）。
- **心智负担：** 需要理解 reducer 模式、action 对象和纯函数的概念。
- **不可变性：** 必须严格遵守在 reducer 中不直接修改 state 的原则，否则会导致难以追踪的 bug。

#### **9. 常见模式与实践**

- **Action 常量：** 将 action type 定义为常量字符串，避免拼写错误。

  ```js
  const ActionTypes = {
    INCREMENT: "INCREMENT",
    DECREMENT: "DECREMENT",
    // ...
  };
  // dispatch({ type: ActionTypes.INCREMENT });
  ```

- **Action 创建函数 (Action Creators):** 创建返回 action 对象的函数，提高代码复用性和一致性。

  ```js
  function increment(amount = 1) {
    return { type: ActionTypes.INCREMENT, payload: amount };
  }
  // dispatch(increment(5));
  ```

- **结合 useContext：** 将 state 和 dispatch 通过 Context 提供给整个子树，实现类似 Redux 的状态管理。

  ```js
  // contexts/CounterContext.js
  const CounterStateContext = React.createContext();
  const CounterDispatchContext = React.createContext();

  function CounterProvider({ children }) {
    const [state, dispatch] = useReducer(counterReducer, initialState);
    return (
      <CounterStateContext.Provider value={state}>
        <CounterDispatchContext.Provider value={dispatch}>
          {children}
        </CounterDispatchContext.Provider>
      </CounterStateContext.Provider>
    );
  }

  function useCounterState() {
    return useContext(CounterStateContext);
  }
  function useCounterDispatch() {
    return useContext(CounterDispatchContext);
  }

  // 在组件中使用
  // const state = useCounterState();
  // const dispatch = useCounterDispatch();
  // dispatch({ type: 'INCREMENT' });
  ```

- **使用 Immer 简化 Reducer：** Immer 库可以让你在 reducer 中以“可变”的方式编写代码，它会自动处理不可变性。

  ```js
  import { useImmerReducer } from "use-immer"; // 需要安装 use-immer

  function immerCounterReducer(draft, action) {
    // 注意参数是 draft
    switch (action.type) {
      case "INCREMENT":
        draft.count += action.payload || 1; // 直接修改 draft
        break; // 在 immer 中 break 或 return 都可以
      case "DECREMENT":
        draft.count -= action.payload || 1;
        break;
      case "SET_STATUS":
        draft.status = action.payload;
        break;
      // default 不需要显式处理，Immer 会返回原 draft（即原 state）
    }
  }

  function MyComponent() {
    const [state, dispatch] = useImmerReducer(
      immerCounterReducer,
      initialState
    );
    // ...
  }
  ```

#### **10. 与 Redux 的对比**

- useReducer 是 React 内置的 Hook，用于组件**局部**或通过 Context 实现**应用级**状态管理。
- Redux 是一个独立的库，通常用于**全局**状态管理，提供更强大的功能（如中间件、时间旅行调试等），但设置更复杂。
- useReducer + useContext 可以实现 Redux 的许多核心功能，对于中小型应用可能是更轻量级的选择。

**总结：** useReducer 是 React 中处理复杂状态逻辑的强大工具。理解其核心概念（reducer 纯函数、action、dispatch、不可变性）以及何时选择它而非 useState，并掌握结合 useContext 等模式，可以显著提升 React 应用的可维护性和可测试性。

| `知识点分类`     | `具体内容`                                                          |
| ---------------- | ------------------------------------------------------------------- |
| 语法             | `const [state, dispatch] = useReducer(reducer, initialState)`       |
| reducer 函数     | `function reducer(state, action) { return newState }`，必须是纯函数 |
| dispatch         | 派发动作（action），告诉 reducer 要做什么                           |
| action           | 一个对象 `{ type: '动作类型', payload: '数据' }`（名字不是固定的）  |
| 初始值           | `initialState`，就是 state 初始的默认值                             |
| 惰性初始化       | 第三个参数：`useReducer(reducer, initialArg, init)`                 |
| 多个状态集中管理 | 一个 reducer 可以管理很多 state 变量，避免 useState 写一堆          |
| 适合场景         | - 状态变化复杂 - 多条件判断 - 多个状态需要统一变动                  |

| `注意点`              | `解释 `                                                             |
| --------------------- | ------------------------------------------------------------------- |
| reducer 必须是纯函数  | 输入一样，输出必须一样，不能有副作用（比如 API 请求、修改外部变量） |
| dispatch 是同步执行的 | 调用 dispatch 后，reducer 立刻执行                                  |
| 状态对象必须不可变    | 必须 return 新对象，不能直接改原 state                              |
| 避免嵌套 dispatch     | dispatch 里不要再 dispatch，容易造成死循环                          |

# useReducer + useContext

useReducer + useContext 是 React 中一种非常强大且常见的组合模式，用于实现**应用级别或区域级别的状态管理**，可以看作是**轻量级的 Redux 替代方案**。

**核心思想：**

1.  **用 useReducer 管理状态逻辑：** 在一个顶层（或区域根）组件中使用 useReducer 来定义状态 (state)、初始状态 (initialState) 和状态更新逻辑 (reducer 函数)，并获取 state 和 dispatch 函数。

1.  **用 useContext 分发状态和更新函数：**

    - 创建两个独立的 Context 对象：一个用于传递 state，另一个用于传递 dispatch 函数。 **（这是最佳实践，原因见下文）**
    - 使用这两个 Context 的 Provider 将 state 和 dispatch 分别注入到组件树中。

1.  **在子组件中消费：** 任何需要访问状态或触发更新的子组件，可以通过 useContext 分别获取 state 或 dispatch。

**为什么分离 state 和 dispatch Context？**

- **性能优化！**

  - dispatch 函数由 React 保证其引用是**稳定**的（在组件生命周期内不会改变）。
  - state 对象通常会在状态更新时**改变引用**（因为 reducer 返回的是新状态）。
  - 如果将 state 和 dispatch 放在同一个 Context 的 value 对象中（例如 `value={{ state, dispatch }}`），那么每次 state 改变时，这个 value 对象的引用也会改变。这将导致**所有**消费该 Context 的组件（即使它们只用到了 dispatch 而不关心 state 的变化）都会**重新渲染**。
  - 通过分离 Context，只依赖 dispatch 的组件（例如只包含按钮来触发动作的组件）就不会因为 state 的变化而重新渲染，从而提高了性能。

#### **示例：实现一个全局计数器**

#### **第 1 步：定义 Reducer 和初始状态**

```js
// src/store/counterReducer.js

export const initialState = {
  count: 0,
  status: "idle", // 假设还有其他状态
};

export const ActionTypes = {
  INCREMENT: "INCREMENT",
  DECREMENT: "DECREMENT",
  RESET: "RESET",
  SET_STATUS: "SET_STATUS",
};

export function counterReducer(state, action) {
  console.log("Reducer executing:", action); // 方便调试
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return { ...state, count: state.count + (action.payload || 1) };
    case ActionTypes.DECREMENT:
      return { ...state, count: state.count - (action.payload || 1) };
    case ActionTypes.RESET:
      return {
        ...state,
        count: action.payload !== undefined ? action.payload : 0,
      };
    case ActionTypes.SET_STATUS:
      return { ...state, status: action.payload };
    default:
      // 对于未知的 action 类型，保持原样或抛出错误
      // throw new Error(`Unknown action type: ${action.type}`);
      return state;
  }
}
```

#### **第 2 步：创建 Context 对象和 Provider 组件**

```js
// src/contexts/CounterContext.js
import React, { createContext, useContext, useReducer } from "react";
import { counterReducer, initialState } from "../store/counterReducer"; // 导入 Reducer 和初始状态

// --- 1. 创建两个 Context 对象 ---
const CounterStateContext = createContext(undefined); // 用于 state
const CounterDispatchContext = createContext(undefined); // 用于 dispatch

// --- 2. 创建 Provider 组件 ---
export function CounterProvider({ children }) {
  // 使用 useReducer 管理状态
  const [state, dispatch] = useReducer(counterReducer, initialState);

  // 使用两个 Provider 分别提供 state 和 dispatch
  return (
    <CounterStateContext.Provider value={state}>
      <CounterDispatchContext.Provider value={dispatch}>
        {children} {/* 被包裹的子组件 */}
      </CounterDispatchContext.Provider>
    </CounterStateContext.Provider>
  );
}

// --- 3. 创建自定义 Hook (推荐) ---
// 自定义 Hook 封装了 useContext 的调用，使消费更方便，并可以添加错误检查
export function useCounterState() {
  const context = useContext(CounterStateContext);
  if (context === undefined) {
    throw new Error("useCounterState must be used within a CounterProvider");
  }
  return context;
}

export function useCounterDispatch() {
  const context = useContext(CounterDispatchContext);
  if (context === undefined) {
    throw new Error("useCounterDispatch must be used within a CounterProvider");
  }
  return context;
}
```

注意：在自定义 Hook 中添加 undefined 检查是一种很好的实践，可以确保这些 Hook 总是在对应的 Provider 内部被调用。

#### **第 3 步：在应用顶层使用 Provider**

```js
// src/App.js
import React from "react";
import { CounterProvider } from "./contexts/CounterContext"; // 导入 Provider
import DisplayCount from "./components/DisplayCount";
import ControlButtons from "./components/ControlButtons";

function App() {
  return (
    // 用 Provider 包裹整个应用或需要访问状态的部分
    <CounterProvider>
      <div>
        <h1>useReducer + useContext 计数器</h1>
        <DisplayCount />
        <ControlButtons />
        {/* 其他应用组件 */}
      </div>
    </CounterProvider>
  );
}

export default App;
```

#### **第 4 步：在子组件中消费 Context**

- **DisplayCount 组件：** 只需要读取 state。
- **ControlButtons 组件：** 只需要 dispatch 来触发更新。

```js
// src/components/DisplayCount.js
import React from "react";
import { useCounterState } from "../contexts/CounterContext"; // 使用自定义 Hook 获取 state

function DisplayCount() {
  // 只从 State Context 获取数据
  const state = useCounterState();
  console.log("DisplayCount rendered"); // 观察渲染

  return (
    <div>
      <h2>当前计数值: {state.count}</h2>
      <p>状态: {state.status}</p>
    </div>
  );
}
// 使用 React.memo 优化：如果 props 不变，且 state 未从 context 改变，则不重渲染
// 但因为这里直接消费了 state context，当 state 变化时，它仍会重渲染，这是符合预期的
export default React.memo(DisplayCount);
```

```js
// src/components/ControlButtons.js
import React from "react";
import { useCounterDispatch } from "../contexts/CounterContext"; // 使用自定义 Hook 获取 dispatch
import { ActionTypes } from "../store/counterReducer"; // 导入 Action 类型常量

function ControlButtons() {
  // 只从 Dispatch Context 获取 dispatch 函数
  const dispatch = useCounterDispatch();
  console.log("ControlButtons rendered"); // 观察渲染

  const handleIncrement = () => {
    dispatch({ type: ActionTypes.INCREMENT });
    dispatch({ type: ActionTypes.SET_STATUS, payload: "incrementing" }); // 可以连续 dispatch
  };

  const handleDecrement = () => {
    dispatch({ type: ActionTypes.DECREMENT });
    dispatch({ type: ActionTypes.SET_STATUS, payload: "decrementing" });
  };

  const handleReset = () => {
    dispatch({ type: ActionTypes.RESET, payload: 10 }); // 带 payload 的 reset
    dispatch({ type: ActionTypes.SET_STATUS, payload: "resetting" });
  };

  return (
    <div>
      <button onClick={handleIncrement}>增加 +</button>
      <button onClick={handleDecrement} style={{ marginLeft: "10px" }}>
        减少 -
      </button>
      <button onClick={handleReset} style={{ marginLeft: "10px" }}>
        重置为 10
      </button>
    </div>
  );
}
// 使用 React.memo 优化：因为 dispatch 函数引用稳定，
// 这个组件理论上只有在挂载时渲染一次（或因父组件强制重渲染而渲染）。
// 当点击按钮，只有 DisplayCount 会因为 state 变化而重渲染。
export default React.memo(ControlButtons);
```

#### **运行与观察：**

1.  加载页面，DisplayCount 和 ControlButtons 都渲染。

1.  点击 "增加 +" 按钮：

    - ControlButtons 调用 dispatch。
    - counterReducer 执行，返回新的 state。
    - CounterStateContext 的 value 改变。
    - DisplayCount 因为 useCounterState 订阅了 CounterStateContext 而重新渲染，显示新的计数值和状态。
    - ControlButtons 因为只依赖 CounterDispatchContext（其 value 即 dispatch 是稳定的），并且被 React.memo 包裹，**不会**重新渲染（可以在控制台日志中确认）。

**总结：**

useReducer + useContext 组合提供了一种结构化、可维护且具备一定性能优化潜力的方式来管理 React 应用中的共享状态。

- **useReducer** 负责状态逻辑的定义和执行。
- **useContext** 负责将 state 和 dispatch 高效地传递给需要的组件。
- **分离 state 和 dispatch Context** 是实现性能优化的关键最佳实践。
- **自定义 Hook** (useMyState, useMyDispatch) 可以让消费 Context 更加简洁和安全。

这种模式是构建中大型 React 应用时，在不引入 Redux 等外部库的情况下管理全局状态的常用且有效的方法。
