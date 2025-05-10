import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

//引入
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/root.tsx";//创建路由对象
import ErrorPage from "./error-page.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <h1>wei and gao</h1>,
    element: < Root/>,
    errorElement: <ErrorPage/>
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 配置和使用路由对象 */}
    <RouterProvider router={router} />
  </StrictMode>
);
