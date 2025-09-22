# 实施总览大步骤

> 本文按照「大步骤 → 小步骤」展开，便于按照现有代码库的结构快速复现实现。所有路径均以项目根目录为基准。

## 一、环境配置

1. 创建 `.env.local`，写入以下键值，供 Vite 与 API 客户端读取：
   - `VITE_API_BASE_URL=https://comp2140a2.uqcloud.net/api`
   - `VITE_API_JWT=TODO: 替换为 Blackboard 提供的 JWT`
   - `VITE_LLM_API_KEY=TODO: 课程提供的占位符`
2. 执行 `npm install` 安装依赖，确认 `package.json` 中的脚本可运行。
3. 运行 `npm run dev -- --port 5176`，确保在 `README.md` 与 `docs/how_to_run.md` 中注明端口 5176。
4. 若首次初始化，按 `docs/build_plan.md` 和 `DEV_PLAN.md` 的阶段提示逐阶段执行并记录自测结论。

## 二、路由配置

1. 在 `src/routes/AppRoutes.jsx` 定义主路由结构，确保以下路径存在：
   - `/` 对应 `src/pages/Dashboard.jsx`，提供首页导航。
   - `/interviews`, `/questions`, `/applicants` 对应各自列表页。
   - `/interviews/new`、`/interviews/:id/edit` 等指向共用编辑页。
   - `/take/:interviewId/:applicantId` 用于候选人面试流程。
2. 在 `src/App.jsx` 内引用 `<AppRoutes />`，并由 `src/components/AppLayout.jsx` 提供统一的 Header/Footer/侧边导航。
3. 在 `src/main.jsx` 使用 `BrowserRouter` 包裹 `<App />`，并引入 `src/styles/index.css` 以启用 TailwindCSS 全局样式。

## 三、静态页面撰写

1. 在 `src/components/AppLayout.jsx` 中定义导航栏与页脚的静态内容（产品标题、快速链接、版权信息）。
2. 在 `src/pages/Dashboard.jsx` 准备欢迎信息与流程引导，引用 `docs/prd.md` 的关键验收点提示用户。
3. 在 `src/pages/NotFound.jsx` 提供 404 兜底页面，并在 `AppRoutes.jsx` 中配置 `*` 路径跳转。
4. 为每个表单页面（如 `src/pages/interviews/InterviewEditorPage.jsx`）添加中文表单说明，帮助用户理解必填字段。

## 四、API 集成

1. 在 `src/services/apiClient.js` 中通过 `getApiBaseUrl()` 与 `getJwtToken()` 读取 `.env.local`，自动注入 `Authorization: Bearer <token>`。
2. 为每个资源建立服务模块：
   - `src/services/interviewApi.js` 处理 `/interview` 的 CRUD。
   - `src/services/questionApi.js` 处理 `/question`，并在请求参数中带上 `interview_id`。
   - `src/services/applicantApi.js` 负责 `/applicant`，含唯一链接生成逻辑。
   - `src/services/answerApi.js` 管理 `/applicant_answer` 的读写。
3. 在 `src/hooks/useAsyncData.js` 封装列表请求，暴露 `data`, `loading`, `error` 三态，方便页面复用。
4. 在 `src/services/genAiApi.js` 中保留 `TODO` 占位符，通过 `VITE_LLM_API_KEY` 注入，将来替换为实际的 LLM 请求。

## 五、组件接入与交互

1. 列表页：
   - `src/pages/interviews/InterviewsPage.jsx`、`src/pages/questions/QuestionsPage.jsx`、`src/pages/applicants/ApplicantsPage.jsx` 使用 `useAsyncData` 获取数据，呈现加载/空数据提示。
   - 在面试列表中展示问题数与应聘者数，可通过 `Promise.all` 组合服务返回值。
2. 表单组件：
   - 共用 `src/components/forms/InterviewForm.jsx`、`QuestionForm.jsx`、`ApplicantForm.jsx`，通过 `onSubmit` 接收父级传入的保存逻辑。
   - 在表单内部加入表单验证与中文注释，提示字段含义与 API 约束。
3. 录音与面试流程：
   - 在 `src/hooks/useAudioRecorder.js` 利用 `MediaRecorder` 管理录音，可暂停但不可重新开始。
   - 在 `src/components/RecorderControls.jsx` 提供按钮 UI，并向 `TakeInterview` 页面暴露状态。
   - `src/pages/take-interview/TakeInterviewLanding.jsx` 控制题目分页、Next-only 流程，以及调用 `transcribeAudio`（位于 `src/utils/transcription.js`）返回的占位文本，随后调用 `answerApi.upsertApplicantAnswer` 保存文本答案。
4. HR 总结：
   - `src/components/ApplicantSummaryPanel.jsx` 调用 `genAiApi.generateSummary`，展示占位摘要，并预留替换实际 LLM 的接口。

## 六、部署与验收

1. 根据 `docs/qa_checklist.md` 核对 Rubric 关键项：录音转写、唯一链接、AI 摘要等是否工作正常。
2. 运行 `npm run build` 验证构建通过，修复 lint 或类型错误。
3. 更新 `docs/process/*.md` 与 `DEV_PLAN.md` 记录阶段性完成情况，标明遗留 `TODO`。
4. 交付前再次确认 `.env.local` 未被提交，`README.md` 的端口、环境变量、示例 Interview 信息准确无误。
