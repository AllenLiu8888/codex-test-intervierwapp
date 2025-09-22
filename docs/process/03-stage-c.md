# 阶段 C：服务层与列表页落地

## 操作步骤
1. 在 `src/utils/env.js` 中封装读取 `VITE_API_BASE_URL`、`VITE_API_JWT`、`VITE_API_USERNAME` 的方法，并提供缺省值与异常提示。
2. 基于上述工具实现 `src/services/apiClient.js`：
   - 统一在请求拦截中附加 `Authorization: Bearer <JWT>` 头；
   - 为 POST/PATCH 请求补充 `username` 字段；
   - 使用 `AbortController` 支持取消；
   - 规范错误处理并返回 JSON。
3. 在 `src/services/interviewApi.js`、`src/services/questionApi.js`、`src/services/applicantApi.js`、`src/services/answerApi.js` 中分别封装列表、详情、创建、更新、删除接口，所有函数都接受 `{ signal }` 以便上层取消请求。
4. 编写 `src/hooks/useAsyncData.js`，包装异步加载流程，提供 `loading`、`error`、`data`、`refetch` 状态并自动取消过期请求。
5. 在 `src/pages/interviews/InterviewsPage.jsx` 调用 `useAsyncData` + `listInterviews` 获取列表，补齐加载/错误/空态，并提供删除后 `refetch()` 与按钮跳转逻辑。
6. 在 `src/pages/questions/QuestionsPage.jsx` 与 `src/pages/applicants/ApplicantsPage.jsx` 中重复同样的模式，增加 URL 查询参数过滤与刷新按钮，使三个列表页结构一致。
7. 在 `src/utils/interviewLinks.js` 中实现 `buildApplicantLink`，为候选人列表页的复制邀请链接提供基础。

## 交付结果
- 所有数据请求均集中在 `src/services` 下完成，页面无需直接 `fetch`。
- 列表页已经具备加载、错误、空数据提示及刷新操作，满足 Rubric 对状态三态的要求。
