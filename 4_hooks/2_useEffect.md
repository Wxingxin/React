# **例子 1：无依赖项 - 每次渲染都执行**

- **场景：** 每次组件渲染（无论是首次加载还是因为状态或 props 更新）后，都想做某件事。一个常见的（但不总是最佳）例子是更新文档标题以反映最新状态。

```js
import React, { useState, useEffect } from "react";

function DocumentTitleUpdater() {
  const [count, setCount] = useState(0);

  // --- useEffect: 无依赖项 ---
  useEffect(() => {
    // 这个函数会在首次渲染完成后，以及每次更新完成后执行
    console.log("Effect (无依赖项): 正在更新标题...");
    document.title = `你点击了 ${count} 次`; // 直接操作 DOM (副作用)
  }); // <--- 注意：没有第二个参数

  console.log("组件正在渲染..."); // 帮助观察渲染时机

  return (
    <div>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>点我增加计数</button>
      <p>(观察浏览器的标题栏和控制台)</p>
    </div>
  );
}

export default DocumentTitleUpdater;
```

- **行为解释：**

  1.  组件首次加载：打印 "组件正在渲染..."，然后打印 "Effect (无依赖项): 正在更新标题..."，浏览器标题变为 "你点击了 0 次"。
  1.  点击按钮：count 状态改变，组件重新渲染。打印 "组件正在渲染..."，然后**再次**打印 "Effect (无依赖项): 正在更新标题..."，浏览器标题变为 "你点击了 1 次"。
  1.  每次点击都会重复步骤 2。这个 Effect 总是在渲染完成后运行。

# **例子 2：空依赖项`[]`- 仅在挂载时执行一次**

- **场景：** 只想在组件第一次加载到页面上（挂载）时执行一次操作，之后不再执行。通常用于：

  - 发起获取初始数据的 API 请求。
  - 设置只需要执行一次的订阅（如事件监听器、定时器）。
  - 初始化第三方库。
  - **关键：** 如果有清理操作（如取消订阅、清除定时器），清理函数也只在组件从页面移除（卸载）时执行一次。

```js
import React, { useState, useEffect } from "react";

function TimerComponent() {
  const [seconds, setSeconds] = useState(0);

  // --- useEffect: 空依赖项 [] ---
  useEffect(() => {
    // 这个函数只在组件首次挂载后执行一次
    console.log("Effect (空依赖项): 组件已挂载，启动定时器！");

    const intervalId = setInterval(() => {
      // 使用函数式更新，确保基于最新的 state 更新
      setSeconds((prevSeconds) => prevSeconds + 1);
      console.log("定时器滴答..."); // 观察定时器是否在运行
    }, 1000); // 每秒执行一次

    // --- 清理函数 ---
    // 这个返回的函数只在组件卸载时执行一次
    return () => {
      console.log("Cleanup (空依赖项): 组件即将卸载，清除定时器！");
      clearInterval(intervalId); // 非常重要，防止内存泄漏
    };
  }, []); // <--- 注意：第二个参数是空数组

  console.log("组件正在渲染...");

  return (
    <div>
      <p>组件已挂载 {seconds} 秒</p>
      <p>(如果移除这个组件，观察控制台的清理日志)</p>
    </div>
  );
}

// 为了演示卸载，可以这样用：
// function App() {
//   const [showTimer, setShowTimer] = useState(true);
//   return (
//     <div>
//       <button onClick={() => setShowTimer(!showTimer)}>
//         {showTimer ? '卸载 Timer' : '挂载 Timer'}
//       </button>
//       {showTimer && <TimerComponent />}
//     </div>
//   );
// }

export default TimerComponent;
```

- **行为解释：**

  1.  组件首次加载：打印 "组件正在渲染..."，然后打印 "Effect (空依赖项): 组件已挂载，启动定时器！"。定时器开始运行，每秒打印 "定时器滴答..." 并更新 seconds。
  1.  无论组件因为 seconds 更新而重新渲染多少次，"组件已挂载..." 这条日志**不会**再出现。
  1.  如果组件被卸载（例如，通过上面注释掉的 App 组件的按钮）：会先打印 "Cleanup (空依赖项): 组件即将卸载，清除定时器！"，然后定时器停止。

# **例子 3：包含依赖项 `[dep]` - 挂载时及依赖项变化时执行**

- **场景：** 当你希望副作用在组件首次挂载时执行，并且在**特定的** props 或 state **发生变化**后**再次**执行。

  - 根据变化的 ID 重新获取数据。
  - 当用户输入变化时，执行某些验证或计算。
  - 当某个 prop 变化时，更新内部状态或执行操作。
  - **关键：** 清理函数会在**下一次** Effect 因依赖变化而执行**之前**运行，以及在组件卸载时运行。

```js
import React, { useState, useEffect } from "react";

function UserDataFetcher({ userId }) {
  // userId 是一个 prop
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- useEffect: 包含依赖项 [userId] ---
  useEffect(() => {
    // 这个函数在首次挂载后执行，并且在 userId prop 变化后的渲染中执行
    console.log(
      `Effect ([userId=${userId}]): 开始为用户 ${userId} 获取数据...`
    );
    setLoading(true);
    setUserData(null); // 开始获取新数据前清空旧数据

    // 模拟 API 请求
    const fetchTimeout = setTimeout(() => {
      const fetchedData = {
        id: userId,
        name: `用户 ${userId}`,
        email: `user${userId}@example.com`,
      };
      console.log(`Effect ([userId=${userId}]): 数据获取成功！`);
      setUserData(fetchedData);
      setLoading(false);
    }, 1500); // 模拟 1.5 秒延迟

    // --- 清理函数 ---
    // 在下次 userId 变化导致 Effect 执行前，或组件卸载前执行
    return () => {
      console.log(
        `Cleanup ([userId=${userId}]): 清理与用户 ${userId} 相关的操作 (比如取消请求)`
      );
      clearTimeout(fetchTimeout); // 如果 userId 变化很快，取消上一个未完成的模拟请求
      setLoading(false); // 确保 loading 状态被重置
    };
  }, [userId]); // <--- 注意：依赖项数组包含 userId

  console.log("组件正在渲染...");

  return (
    <div>
      <h4>当前用户 ID: {userId}</h4>
      {loading && <p>正在加载用户数据...</p>}
      {userData && !loading && <pre>{JSON.stringify(userData, null, 2)}</pre>}
    </div>
  );
}

// 如何使用这个组件：
// function App() {
//   const [currentUserId, setCurrentUserId] = useState(1);
//   return (
//     <div>
//       <button onClick={() => setCurrentUserId(1)}>查看用户 1</button>
//       <button onClick={() => setCurrentUserId(2)}>查看用户 2</button>
//       <button onClick={() => setCurrentUserId(currentUserId + 1)}>下一个用户</button>
//       <hr />
//       <UserDataFetcher userId={currentUserId} />
//     </div>
//   );
// }

export default UserDataFetcher;
```

- **行为解释：**

  1.  组件首次加载（假设 userId 为 1）：打印 "组件正在渲染..."，然后打印 "Effect (`[userId=1]`): 开始为用户 1 获取数据..."，显示加载状态。1.5 秒后，获取数据，打印 "...数据获取成功！"，显示用户 1 的数据。

  1.  点击按钮将 userId 改为 2：组件因 userId prop 变化而重新渲染。

      - 首先，**上一个 Effect 的清理函数**会执行：打印 "Cleanup (`[userId=1]`): 清理与用户 1 相关的操作..."。
      - 然后，打印 "组件正在渲染..."。
      - 接着，**新的 Effect** 因为 userId 变化而执行：打印 "Effect (`[userId=2]`): 开始为用户 2 获取数据..."，显示加载状态。1.5 秒后，获取数据，打印 "...数据获取成功！"，显示用户 2 的数据。

  1.  如果再次点击按钮将 userId 改回 1，会重复步骤 2（先清理用户 2 的，再执行用户 1 的 Effect）。

  1.  如果 userId 没有变化，即使父组件因为其他原因重渲染导致 UserDataFetcher 也重渲染，这个 Effect **不会**执行。

这些例子展示了 useEffect 三种核心用法，理解它们何时执行以及何时运行清理函数是掌握 useEffect 的关键。

# 清理副作用（返回函数）

# **1. 清除定时器 (setInterval 或 setTimeout)**

- **场景：** 在组件挂载后启动一个定时器，在组件卸载前必须清除它，否则定时器会继续在后台运行，可能导致内存泄漏，或者在组件卸载后尝试更新状态而引发错误。

```js
import React, { useState, useEffect } from "react";

function IntervalTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Effect: 定时器启动");
    // 启动一个每秒执行一次的 interval 定时器
    const intervalId = setInterval(() => {
      setCount((c) => c + 1); // 使用函数式更新，安全可靠
      console.log("定时器 tick...");
    }, 1000);

    // --- 清理函数 ---
    // 这个函数会在组件卸载时执行
    return () => {
      console.log("Cleanup: 清除定时器, ID:", intervalId);
      clearInterval(intervalId); // 使用 clearInterval 清除定时器
    };
  }, []); // 空依赖数组，表示只在挂载和卸载时执行 effect 和 cleanup

  return (
    <div>
      <p>定时器计数: {count}</p>
      <p>(组件卸载时观察控制台)</p>
    </div>
  );
}

// --- 如何在父组件中使用以观察卸载 ---
// function App() {
//   const [showTimer, setShowTimer] = useState(true);
//   return (
//     <div>
//       <button onClick={() => setShowTimer(!showTimer)}>
//         {showTimer ? '卸载定时器组件' : '挂载定时器组件'}
//       </button>
//       {showTimer && <IntervalTimer />}
//     </div>
//   );
// }

export default IntervalTimer; // 导出以便在 App 中使用
```

- **解释：**

  - useEffect 在组件挂载后运行，setInterval 启动定时器，并将其返回的 ID 存储在 intervalId 变量中。
  - useEffect 返回的清理函数会在组件即将卸载时被调用。
  - 清理函数内部调用 clearInterval(intervalId)，传入之前存储的 ID，明确地停止了该定时器。

# **2. 移除事件监听器 (addEventListener)**

- **场景：** 在组件挂载后向 window、document 或其他 DOM 元素添加了事件监听器。在组件卸载前必须移除这些监听器，否则它们会继续存在，可能导致内存泄漏，并且监听器函数可能会在组件不存在时被调用。

```js
import React, { useState, useEffect } from "react";

function WindowResizer() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 定义事件处理函数
  const handleResize = () => {
    console.log("窗口大小改变了！");
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    console.log("Effect: 添加 resize 事件监听器");
    // 向 window 添加 resize 事件监听器
    window.addEventListener("resize", handleResize);

    // --- 清理函数 ---
    // 这个函数会在组件卸载时执行
    return () => {
      console.log("Cleanup: 移除 resize 事件监听器");
      // 移除事件监听器，必须传入与添加时相同的事件类型和函数引用
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 空依赖数组，只在挂载和卸载时处理监听器

  return (
    <div>
      <p>当前窗口宽度: {windowWidth}px</p>
      <p>(尝试调整浏览器窗口大小，并在组件卸载时观察控制台)</p>
    </div>
  );
}
export default WindowResizer; // 导出
```

- **解释：**

  - useEffect 在挂载后运行，调用 window.addEventListener('resize', handleResize) 添加监听器。
  - 关键在于清理函数：它调用 window.removeEventListener('resize', handleResize)。**非常重要**的是，传递给 removeEventListener 的函数引用 (handleResize) 必须与传递给 addEventListener 的**完全相同**。
  - 这样可以确保监听器被正确注销。

# **3. 取消网络请求 (例如 fetch 使用 AbortController)**

- **场景：** 组件挂载或某个依赖项变化后发起网络请求。如果在请求完成前组件就卸载了，或者依赖项再次变化触发了新的请求，之前的请求仍在进行中。当它最终完成时，可能会尝试更新一个已经卸载的组件的状态，导致 React 警告或错误。使用 AbortController 可以取消进行中的 fetch 请求。

```js
import React, { useState, useEffect } from "react";

function DataFetcher({ query }) {
  // query 是一个 prop，会变化
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(`Effect: 准备为查询 "${query}" 发起请求`);
    setLoading(true);
    setData(null); // 清空旧数据

    // 1. 创建 AbortController 实例
    const controller = new AbortController();
    const signal = controller.signal; // 获取信号

    const fetchData = async () => {
      try {
        // 2. 将 signal 传递给 fetch 的 options
        const response = await fetch(
          `https://api.example.com/search?q=${query}`,
          { signal }
        );

        // 检查请求是否在 fetch 完成后但在解析前被中止
        if (signal.aborted) {
          console.log(`请求 "${query}" 在解析前被中止`);
          return;
        }

        const result = await response.json();
        console.log(`Effect: 查询 "${query}" 的数据获取成功`);
        setData(result);
      } catch (error) {
        // 3. 检查错误是否是因为中止操作
        if (error.name === "AbortError") {
          console.log(`Cleanup: 查询 "${query}" 的 Fetch 请求被中止`);
        } else {
          console.error(`查询 "${query}" 时发生错误:`, error);
          // 处理其他网络错误
        }
      } finally {
        // 确保即使中止了，loading 状态也更新 (如果信号未中止)
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // --- 清理函数 ---
    // 在下次 query 变化导致 Effect 重新运行前，或组件卸载前执行
    return () => {
      console.log(`Cleanup: 准备中止查询 "${query}" 的请求`);
      // 4. 调用 abort() 来取消请求
      controller.abort();
      setLoading(false); // 确保 loading 状态被重置
    };
  }, [query]); // 依赖项是 query，当 query 变化时 Effect 会重新运行

  return (
    <div>
      <h4>查询: {query}</h4>
      {loading && <p>加载中...</p>}
      {data && !loading && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <p>(快速改变查询词以观察请求中止)</p>
    </div>
  );
}
export default DataFetcher; // 导出
```

- **解释：**

  - 在 useEffect 内部，创建一个 AbortController。
  - 将其 signal 传递给 fetch 的 options 对象。
  - 清理函数中调用 controller.abort()。这会向 fetch 发送一个中止信号。
  - fetch 接收到信号后会 reject 一个 DOMException，其 name 为 'AbortError'，可以在 catch 块中捕获并识别出来，避免将其视为普通网络错误。
  - 这样，即使请求已经发出，也可以在需要时（组件卸载或发起新请求时）取消它，防止后续的 .then() 或状态更新尝试在不合适的时机执行。

# **4. 清除订阅 (例如，来自外部数据源或库)**

- **场景：** 组件订阅了某个外部数据源（如 WebSocket、RxJS Observable、或其他发布/订阅模式的服务）。当组件不再需要这些数据（卸载时）或需要切换到不同的订阅目标时，必须取消订阅以释放资源并停止接收不再需要的数据。

```js
import React, { useState, useEffect } from "react";

// --- 模拟一个简单的外部数据源 ---
const mockExternalSource = {
  _subscribers: [],
  subscribe(callback) {
    console.log("外部源: 添加了一个订阅者");
    this._subscribers.push(callback);
    // 返回一个用于取消订阅的函数
    const unsubscribe = () => {
      console.log("外部源: 移除了一个订阅者");
      this._subscribers = this._subscribers.filter((cb) => cb !== callback);
    };
    return unsubscribe;
  },
  // 模拟数据推送
  _intervalId: null,
  startPushing() {
    if (!this._intervalId) {
      this._intervalId = setInterval(() => {
        const newMessage = `新消息 @ ${new Date().toLocaleTimeString()}`;
        console.log(`外部源: 推送消息 "${newMessage}"`);
        this._subscribers.forEach((cb) => cb(newMessage));
      }, 3000); // 每 3 秒推送一次
    }
  },
  stopPushing() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
      console.log("外部源：停止推送");
    }
  },
};
mockExternalSource.startPushing(); // 启动模拟推送
// --- 组件 ---

function MessageSubscriber() {
  const [message, setMessage] = useState("等待消息...");

  useEffect(() => {
    console.log("Effect: 订阅外部消息源");

    // 定义接收消息的回调
    const handleNewMessage = (newMessage) => {
      console.log("组件: 收到了新消息:", newMessage);
      setMessage(newMessage);
    };

    // 调用订阅方法，它返回一个取消订阅的函数
    const unsubscribe = mockExternalSource.subscribe(handleNewMessage);

    // --- 清理函数 ---
    // 这个函数会在组件卸载时执行
    return () => {
      console.log("Cleanup: 取消订阅外部消息源");
      // 直接调用从 subscribe 返回的取消订阅函数
      unsubscribe();
    };
  }, []); // 空依赖数组，只在挂载和卸载时订阅/取消订阅

  return (
    <div>
      <p>收到的最新消息: {message}</p>
      <p>(组件卸载时观察控制台)</p>
    </div>
  );
}
export default MessageSubscriber; // 导出
```

- **解释：**

  - useEffect 在挂载后运行，调用 mockExternalSource.subscribe() 并传入一个回调函数 handleNewMessage 来处理接收到的数据。
  - subscribe 方法按照约定返回了一个名为 unsubscribe 的函数，调用这个函数即可取消当前的订阅。
  - useEffect 的清理函数直接返回了这个 unsubscribe 函数。当组件卸载时，React 会自动调用这个返回的 unsubscribe 函数，从而完成订阅的清理。

这些例子覆盖了 useEffect 清理副作用最常见的几种情况。核心思想都是：在 useEffect 主体中设置副作用，并返回一个函数，该函数负责执行与设置过程相反的“拆卸”或“清理”操作。
