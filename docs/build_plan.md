# 从零开始构建 ReadySetHire 的步骤计划

> 以下步骤以课程提供的 PRD 与规则为准，所有命令均在项目根目录执行。

## 阶段 1：初始化与规则对齐
1. 克隆或下载代码仓库，确保目录结构与 `/rules`、`/docs` 已存在。
2. 阅读 `/rules/*.md` 和 `/docs/prd.md`、`/docs/api.md`，理解架构约束、Rubric 验收点与 API 用法。
3. 安装依赖：`npm install`（若在学校镜像外，请先配置 npm registry 访问）。

## 阶段 2：开发环境配置
1. 在项目根目录创建 `.env.local`，填入：
   ```
   VITE_API_BASE_URL=https://comp2140a2.uqcloud.net/api
   VITE_API_JWT=在 Blackboard 上获取的 JWT
   VITE_LLM_API_KEY=占位或真实的 LLM Key（如暂未获取可先留空）
   ```
2. 可选：如 JWT Payload 不含 `username`，额外配置 `VITE_API_USERNAME=学号`。
3. 运行 `npm run dev`，确认 Vite 监听 `http://localhost:5176` 并能正常打开欢迎页。

## 阶段 3：基础框架与路由
1. 在 `src/main.jsx` 中挂载 `BrowserRouter` 与全局样式。
2. 在 `src/routes/AppRoutes.jsx` 定义布局路由：`/` 仪表盘、`/interviews`、`/questions`、`/applicants` 及候选人端 `/take/:applicantId`。
3. 创建 `src/components/AppLayout.jsx`，提供统一 Header/Footer/导航。

## 阶段 4：服务层与数据拉取
1. 在 `src/services/apiClient.js` 封装基础请求逻辑：读取 `VITE_API_BASE_URL`、自动附加 `Authorization: Bearer ${VITE_API_JWT}`。
2. 按资源划分 `interviewApi.js`、`questionApi.js`、`applicantApi.js`、`answerApi.js`，所有请求调用 `withOwner` 附带 `username`。
3. 编写 `useAsyncData` Hook，处理加载、错误与中断逻辑。

## 阶段 5：CRUD 页面与表单
1. 在 `src/components/forms` 下实现 Interview/Question/Applicant 共用表单，涵盖校验与错误提示。
2. 在对应 `pages/*` 中组合列表视图与表单页面：
   - 列表：展示三态（加载/空/错误）与操作按钮（刷新、跳转）。
   - 编辑页：通过 `useParams` 判断新建或编辑，复用表单组件。
3. 验证 Interview/Question/Applicant 的增删改查均可触发 API 并刷新列表。

## 阶段 6：Take Interview 流程
1. 使用 `useAudioRecorder` Hook 管理录音、暂停、恢复与停止，禁止重录。
2. 录音完成后调用 `transcribeAudio`（占位实现），将文本答案通过 `answerApi` 保存，逐题推进。
3. 所有题目完成后更新候选人状态为 `Completed`，展示感谢页面。

## 阶段 7：Advanced GenAI
1. 在 `src/services/genAiApi.js` 读取 `VITE_LLM_API_KEY`，当前使用占位逻辑模拟响应。
2. 在候选人列表中提供 AI Summary 面板，演示如何拉取答案并调用占位服务。

## 阶段 8：自测与交付
1. 对照 `/docs/qa_checklist.md` 完成手动核对：API 是否集中化、UI 是否一致、录音流程是否符合 Rubric。
2. 运行 `npm run build`，确保编译通过。
3. 更新 `README.md` 与 `docs/how_to_run.md` 说明环境变量、端口与 GenAI 占位方式。
4. 提交代码并撰写 PR，总结功能与测试记录。

> 完成以上步骤即可复现当前项目功能。如需扩展真实的语音转写或 LLM 能力，可在阶段 7 之后按需替换占位实现。
