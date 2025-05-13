# React useRef Hook 的所有关键知识点。

#### **1. 核心概念**

- **useRef 是什么？** 它是 React 提供的一个内置 Hook。
- **作用：** useRef 返回一个**可变的 (mutable)** ref 对象，其 .current 属性被初始化为传入的参数 (initialValue)。
- **持久性：** 这个返回的 ref 对象在组件的**整个生命周期内保持不变**（即每次渲染都返回同一个 ref 对象引用）。
- **关键特性：** **修改 ref 对象的 .current 属性** **不会** **触发组件的重新渲染。** 这是它与 useState 最本质的区别。

#### **2. 基本语法**

```js
import React, { useRef } from "react";

function MyComponent() {
  // 1. 初始化 ref，可以传入一个初始值
  const myRef = useRef(initialValue);

  // 2. 访问当前值
  console.log(myRef.current);

  // 3. 修改当前值 (不会触发重渲染!)
  // 通常在事件处理函数或 useEffect 中修改
  const handleClick = () => {
    myRef.current = newValue;
    console.log("Ref updated to:", myRef.current);
    // 注意：即使这里修改了 myRef.current，组件的 UI 不会立即因为这个修改而更新
  };

  // ... JSX ...
}
```

- initialValue: ref 对象 .current 属性的初始值。如果省略，.current 初始为 undefined。
- myRef: useRef 返回的 ref 对象。它是一个普通的 JavaScript 对象，形如 { current: initialValue }。
- myRef.current: 存储实际值的地方。你可以读取它，也可以直接修改它。

#### **3. 主要用途**

useRef 主要有两个核心用途：

**a) 访问 DOM 节点或 React 组件实例**

- **这是最常见的用途。** 你可以将 useRef 返回的 ref 对象附加到 JSX 元素的 ref 属性上。
- 当该 JSX 元素被渲染到 DOM 中后，React 会将对应的**原生 DOM 节点**（或类组件实例）赋值给 ref 对象的 .current 属性。
- 当组件卸载时，.current 属性会被重新设置为 null。

```js
import React, { useRef, useEffect } from "react";

function TextInputWithFocusButton() {
  // 1. 创建一个 ref 来存储 input 元素的引用
  const inputEl = useRef(null); // 初始值为 null 是常见做法

  const onButtonClick = () => {
    // 3. 在事件处理函数中访问 DOM 节点
    // inputEl.current 现在指向 <input> DOM 节点
    if (inputEl.current) {
      inputEl.current.focus(); // 调用 DOM 节点的 focus 方法
      console.log("Input value:", inputEl.current.value);
    }
  };

  useEffect(() => {
    // 可以在 useEffect 中访问，确保 DOM 已经挂载
    console.log("Input element mounted:", inputEl.current);
    // 在组件卸载时，可以观察到清理函数中 current 为 null (如果需要清理)
    return () => {
      console.log("Input element will unmount, current:", inputEl.current); // 此时可能还未完全移除
    };
  }, []);

  return (
    <>
      {/* 2. 将 ref 附加到 input 元素的 ref 属性 */}
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

- **使用场景：**

  - 管理焦点、文本选择或媒体播放。
  - 触发强制动画。
  - 获取 DOM 元素的尺寸或位置。
  - 集成不使用 React 的第三方 DOM 库。

**b) 存储跨渲染周期的可变值（且不触发重渲染）**

- 由于修改 .current 不会触发重渲染，useRef 可以用来存储那些你需要在多次渲染之间**保持不变**，但**改变时又不需要更新 UI** 的值。
- 它就像是函数组件中的一个“实例变量”。

```js
import React, { useState, useEffect, useRef } from "react";

function Timer() {
  const [count, setCount] = useState(0);
  // 使用 ref 存储 interval ID
  const intervalRef = useRef(null);

  useEffect(() => {
    // 启动定时器，并将 ID 存入 ref
    intervalRef.current = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);
    console.log("Timer started, interval ID:", intervalRef.current);

    // 清理函数：在组件卸载时清除定时器
    return () => {
      console.log("Clearing interval with ID:", intervalRef.current);
      clearInterval(intervalRef.current); // 使用 ref 中存储的 ID
    };
  }, []); // 空依赖数组，只在挂载和卸载时运行

  const handleStop = () => {
    console.log("Stopping timer with ID:", intervalRef.current);
    clearInterval(intervalRef.current);
    intervalRef.current = null; // 可以选择重置 current
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleStop}>Stop Timer</button>
    </div>
  );
}
```

- **使用场景：**

  - 存储定时器 ID (setInterval, setTimeout) 以便后续清除。
  - 存储 WebSocket 连接、订阅等需要手动清理的资源引用。
  - 存储上一次的 state 或 props 值，用于比较或计算。
  - 存储某些计算的缓存结果（但 useMemo 可能更适合纯计算缓存）。
  - 作为需要在多次渲染间保持一致的标志位或计数器（但不直接影响 UI）。

#### **4. useRef vs useState**

| 特性           | useRef                                         | useState                                |
| -------------- | ---------------------------------------------- | --------------------------------------- |
| **返回值**     | 一个包含 .current 属性的可变对象               | `[currentState, setStateFunction]` 数组 |
| **修改方式**   | 直接修改 `.current` 属性 `(ref.current = ...)` | 调用 setState 函数                      |
| **触发重渲染** | **否**                                         | **是**                                  |
| **异步性**     | 修改是**同步**的                               | setState 的更新是**异步**（批处理）的   |
| **主要用途**   | 访问 DOM；存储不触发 UI 更新的可变值           | 管理需要在 UI 中反映出来的状态          |

**关键选择依据：** 如果值的改变需要**立即**反映在用户界面上，使用 useState。如果需要引用 DOM 节点，或者需要一个跨渲染周期保持不变、但其改变不应触发 UI 更新的“容器”，使用 useRef。

#### **5. 何时访问 ref.current (特别是 DOM Refs)**

- **DOM Refs 的 .current 赋值时机：** React 会在**组件挂载 (mount)** 完成后，将 DOM 节点赋给 .current。它会在**组件卸载 (unmount)** 之前，将 .current 设回 null。这个过程发生在**渲染提交 (commit) 阶段**。

- **安全访问时机：**

  - **useEffect / useLayoutEffect 内部：** 这些 Hook 在 DOM 更新后运行，是访问 DOM ref 的最安全时机。
  - **事件处理函数中：** 事件（如 onClick）通常在 DOM 已经存在时触发，可以安全访问。

- **不安全访问时机：**

  - **组件渲染期间（函数体内部）：** 在首次渲染完成前，.current 对于 DOM ref 来说是 null。在后续渲染中，它持有的是 上一次 渲染的 DOM 节点（或 null 如果条件渲染移除了它），直到 commit 阶段才更新。直接在渲染逻辑中使用 ref.current 可能导致不一致或错误。

#### **6. useRef 与 useEffect 依赖项**

- useRef 返回的 **ref 对象本身**的引用是稳定的，不会改变。因此，将 ref 对象本身放入 useEffect 的依赖数组通常是**没有意义**的，也不会因为 ref.current 的改变而触发 effect。

  ```js
  useEffect(() => {
    // ... 使用 myRef.current ...
  // }, [myRef]); // <-- 这样写通常没用，因为 myRef 的引用不变

  ```

- 如果你确实需要在 ref.current 变化时执行某些逻辑（这通常表明可能应该用 useState），你需要找到**其他触发 Effect 的依赖项**，或者在能够修改 ref.current 的地方（如事件处理器）直接执行该逻辑。

#### **7. forwardRef (与 useRef 配合使用)**

- 默认情况下，你**不能**将 ref prop 直接传递给你自己编写的**函数组件**。
- 如果你想让父组件能够获取子函数组件内部的某个 DOM 节点（或其他值）的 ref，子组件需要使用 React.forwardRef 来包裹。
- forwardRef 接收一个渲染函数，该函数除了 props 外，还会接收第二个参数 ref，你可以将这个 ref 传递给子组件内部的某个 DOM 元素。

```js
import React, { useRef, useImperativeHandle, forwardRef } from "react";

// 子组件使用 forwardRef
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  // 使用 useImperativeHandle 可以自定义暴露给父组件的 ref 实例值
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    getValue: () => {
      return inputRef.current.value;
    },
    // 可以暴露更多方法
  }));

  return <input ref={inputRef} {...props} />;
});

// 父组件
function ParentComponent() {
  const fancyInputRef = useRef();

  const handleFocus = () => {
    if (fancyInputRef.current) {
      fancyInputRef.current.focus(); // 调用子组件暴露的 focus 方法
      console.log(fancyInputRef.current.getValue());
    }
  };

  return (
    <>
      <FancyInput ref={fancyInputRef} placeholder="Fancy Input" />
      <button onClick={handleFocus}>Focus Fancy Input</button>
    </>
  );
}
```

- useImperativeHandle Hook 通常与 forwardRef 结合使用，允许你**限制或自定义**父组件通过 ref 能访问到的子组件实例上的方法或属性，而不是直接暴露整个 DOM 节点或组件实例。

**总结：** useRef 是 React Hooks 中一个非常基础且重要的工具。掌握它的两个核心用途（访问 DOM 和存储不触发渲染的可变值）、理解它与 useState 的关键区别（不触发重渲染）、知道何时安全访问 .current 以及如何与 forwardRef 配合使用，对于编写健壮和高效的 React 应用至关重要。

| `知识点分类`     | `内容`                                                |
| ---------------- | ----------------------------------------------------- |
| 语法             | `const refContainer = useRef(initialValue)`           |
| 返回值           | `{ current: initialValue }`对象                       |
| 不触发渲染       | 修改 `ref.current` 不会导致组件重新渲染               |
| 常用用途 1       | 获取和操作 DOM 元素                                   |
| 常用用途 2       | 存储任意变量，避免重新渲染丢失                        |
| 常用用途 3       | 跨渲染周期存储值（比如保存定时器 id、上一次的 props） |
| 和 useState 区别 | `useState` 变化会重新渲染，`useRef` 不会              |

| `注意点`                               | `解释`                                                               |
| -------------------------------------- | -------------------------------------------------------------------- |
| 修改 current 不会引起重新渲染          | 所以不要指望改了 `ref.current` 页面自动更新                          |
| 通常用来保存 “不会引起 UI 变化” 的数据 | 比如 timer id、前一次的 props、某个 flag                             |
| 访问 DOM 元素时用 ref                  | 比如 input，div，canvas 等                                           |
| 和 forwardRef 一起使用                 | `useRef` + `forwardRef` 可以给子组件传递 ref（父组件操作子组件 DOM） |

# React useId Hook 的所有关键知识点

#### **1. 核心概念与目的**

- **useId 是什么？** 它是 React v18 引入的一个内置 Hook。
- **目的：** 主要用于生成**稳定且唯一**的 ID，这些 ID 在**服务端渲染 (SSR)** 和**客户端渲染 (CSR)** 之间保持一致，从而避免 hydration（水合）错误。它主要解决了在需要唯一 ID（尤其是在无障碍 accessibility 属性中）时，手动生成 ID 可能导致的 hydration 冲突问题。
- **核心解决的问题：** 确保 htmlFor 和 id、aria-describedby 和 id 等需要匹配 ID 的属性在 SSR 输出和服务端 hydration 后能够正确关联，即使在流式 SSR 或选择性 hydration 等复杂场景下也能工作。

#### **2. 基本语法**

```js
import React, { useId } from "react";

function MyComponent() {
  // 调用 useId Hook 获取一个唯一的 ID 字符串
  const uniqueId = useId();

  // 使用这个 ID
  return (
    <div>
      <label htmlFor={uniqueId}>标签:</label>
      <input id={uniqueId} type="text" />
    </div>
  );
}
```

- **useId():** 调用 Hook，无需任何参数。

- **返回值 (uniqueId):** 返回一个**不透明 (opaque)** 的字符串。这个字符串保证在当前渲染树中是唯一的，并且在服务端和客户端之间是稳定的。

  - **格式：** 返回的 ID 通常包含冒号 (:)，例如 :r0:、:r1: 等（但**你不应该依赖这个具体格式**，它属于 React 的内部实现，未来可能改变）。
  - **关键：** 你只需知道它是一个唯一的、可安全用于 ID 属性的字符串。

#### **3. 主要特点与行为**

- **唯一性 (Uniqueness):**

  - 在**同一个**组件中多次调用 useId 会生成**不同**的唯一 ID。
  - 在**不同**组件实例中调用 useId 也会生成唯一的 ID。
  - 其唯一性是相对于整个 React 应用的渲染树而言的。

- **稳定性 (Stability):** 对于组件的**同一次渲染**中的**同一个 useId 调用**，它返回的 ID 在组件的整个生命周期内（包括重新渲染）是**稳定不变**的。

- **SSR & Hydration 安全 (SSR & Hydration Safe):** 这是 useId 最核心的优势。React 确保服务端生成的 ID 和客户端 hydration 时生成的 ID 是匹配的，避免了因为 ID 不匹配而导致的 DOM 结构错误或 accessibility 问题。

- **无依赖项 (No Dependencies):** useId 不接受任何参数，也没有依赖数组。它的值仅基于其在组件树中的调用位置。

#### **4. 主要使用场景（Accessibility）**

useId 最主要的应用场景是生成用于无障碍属性的 ID：

- **关联 label 和表单控件 (input, textarea, select):**

  ```js
  const inputId = useId();
  return (
    <>
      <label htmlFor={inputId}>邮箱地址:</label>
      <input id={inputId} type="email" />
    </>
  );
  ```

- **关联描述性元素 (aria-describedby):**

  ```js
  const inputId = useId();
  const helpTextId = useId();
  return (
    <>
      <label htmlFor={inputId}>密码:</label>
      <input id={inputId} type="password" aria-describedby={helpTextId} />
      <p id={helpTextId} style={{ fontSize: "0.8em", color: "grey" }}>
        密码至少需要8个字符。
      </p>
    </>
  );
  ```

- **关联标签元素 (aria-labelledby):** 当一个元素由页面上其他地方的文本作为标签时使用。

  ```js
  const titleId = useId();
  const sectionId = useId();
  return (
    <section aria-labelledby={titleId} id={sectionId}>
      <h2 id={titleId}>个人信息</h2>
      {/* ... 其他内容 ... */}
    </section>
  );
  ```

#### **5. 生成多个相关 ID 的最佳实践**

如果你需要为一组相关的元素（例如一个输入框、它的标签、它的错误提示）生成 ID，**不应该**为每个元素都调用一次 useId。

**正确做法：** 调用 useId **一次**获取一个基础 ID，然后使用这个基础 ID 作为前缀或后缀来派生出其他的相关 ID。

```js
import React, { useId } from "react";

function FormField({ label, helpText }) {
  // 只调用一次 useId 获取基础 ID
  const baseId = useId();

  // 派生出相关的 ID
  const inputId = `${baseId}-input`;
  const helpTextId = helpText ? `${baseId}-helptext` : undefined;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor={inputId}>{label}:</label>
      <input
        id={inputId}
        type="text"
        aria-describedby={helpTextId} // 只有在 helpText 存在时才添加描述
      />
      {helpText && (
        <p
          id={helpTextId}
          style={{ fontSize: "0.8em", color: "grey", margin: "0.2em 0 0 0" }}
        >
          {helpText}
        </p>
      )}
    </div>
  );
}

// 使用：
// <FormField label="用户名" helpText="请输入您的用户名" />
// <FormField label="密码" />
```

- **原因：** 这样做不仅减少了 Hook 的调用次数，更重要的是保持了这些相关元素 ID 之间的**语义联系**，使得生成的 DOM 结构更清晰。

#### **6. useId 不适用于什么场景？**

- **生成列表的 key prop:** **绝对不要**使用 useId 来生成列表项的 key。列表的 key 必须基于数据本身，并且在重新排序、添加或删除项时保持稳定或有意义地改变。useId 生成的 ID 与数据无关，会导致性能问题和状态管理错误。应该使用数据中固有的唯一标识符（如 item.id）。
- **CSS 选择器:** 由于 useId 生成的 ID 格式（包含 :）可能与 CSS 选择器或某些库（如 querySelector）不兼容，且其格式不保证稳定，**不推荐**直接在 CSS 中依赖 useId 生成的 ID 来应用样式。应该使用普通的 CSS 类名或稳定的 data-\* 属性。
- **数据标识符:** useId 生成的 ID 只在渲染期间有意义，**不应该**用作数据库中的主键、状态管理中的键或其他需要持久化或在应用逻辑中引用的标识符。

**总结：**

useId 是 React v18 中一个专注于解决特定问题（SSR/Hydration 中唯一且稳定 ID 的生成）的 Hook，主要服务于**无障碍 (Accessibility)** 属性的需求。它的核心优势在于**简单、稳定、且对服务端渲染友好**。理解它的正确使用场景（关联 label/input、ARIA 属性）和不适用的场景（列表 key、CSS 选择器、数据 ID），并掌握生成多个相关 ID 的最佳实践（调用一次，派生多个），是有效利用 useId 的关键。

| `知识点` | `内容`                                                                    |
| -------- | ------------------------------------------------------------------------- |
| 基本用法 | `const id = useId();`                                                     |
| 返回值   | 一个字符串（唯一的 ID，比如 `:r0:`）                                      |
| 特点 1   | 每次渲染期间，这个 ID 都是一样的（不会变）                                |
| 特点 2   | 在服务器端渲染（SSR）和客户端渲染时，ID 保持一致                          |
| 特点 3   | 可以防止 SSR 和客户端 hydration（复用）时出现 ID 不匹配                   |
| 适用场景 | `input`、`label`、`aria-*` 属性等地方需要唯一 ID 时                       |
| 注意事项 | 不要把 `useId` 生成的 ID 直接暴露到 URL 或数据库（它是内部生成的随机 ID） |

| `注意点`                        | `解释`                                                        |
| ------------------------------- | ------------------------------------------------------------- |
| 只在组件内调用                  | 和其他 Hook 一样，必须在组件顶层使用                          |
| 不能拿去做 URL 参数、数据库主键 | 这些 ID 是 React 内部规则生成的，不稳定，不适合外部用         |
| SSR 中特别重要                  | 解决服务器和客户端生成的 ID 不一致的问题，防止 hydration 警告 |
| 与自定义 ID 结合使用            | 如果需要可以传递自定义前缀，手动生成更易读的 ID               |
