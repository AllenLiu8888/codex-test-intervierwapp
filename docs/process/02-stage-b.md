# 阶段 B：项目初始化与基础框架

## 操作步骤
1. 通过 `package.json` 引入 Vite、React、React Router、TailwindCSS 及相关构建依赖，确保脚手架命令（如 `npm run dev`、`npm run build`）可用。
2. 在 `vite.config.js` 中调用 `@vitejs/plugin-react` 并将 `server.port` 设置为 5176，满足题目要求的本地端口。
3. 在 `tailwind.config.js` 和 `postcss.config.js` 中配置 Tailwind 运行所需的 preset 与插件，解锁原子化样式能力。
4. 更新 `index.html`，引入 `src/main.jsx` 入口并为应用设置基础的语言属性与根节点。
5. 在 `src/main.jsx` 中挂载 `BrowserRouter` 与 `App` 组件，统一导入全局样式 `src/styles/index.css`。
6. 在 `src/App.jsx` 内渲染路由出口 `AppRoutes`，保持应用结构清晰。
7. 实现 `src/routes/AppRoutes.jsx`，声明 Dashboard、Interviews、Questions、Applicants、Take Interview、Not Found 等页面路由。
8. 编写 `src/components/AppLayout.jsx` 作为全局布局，提供头部导航、内容容器与页脚，使所有页面保持一致的 UI 框架。
9. 初始化各页面骨架：`src/pages/Dashboard.jsx`、`src/pages/interviews/InterviewsPage.jsx`、`src/pages/questions/QuestionsPage.jsx`、`src/pages/applicants/ApplicantsPage.jsx`、`src/pages/take-interview/TakeInterviewLanding.jsx`、`src/pages/NotFound.jsx`，填入占位结构与中文注释。
10. 在 `src/styles/index.css` 引入 Tailwind base/components/utilities，并补充全局背景色与字体等基础样式。

## 交付结果
- 启动 `npm run dev` 时会加载 `AppLayout` 提供的统一导航和页脚结构。
- 所有页面文件均存在并可通过路由访问，占位内容为后续数据逻辑做好准备。
