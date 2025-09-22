# 阶段 E：候选人面试流程与录音转写

## 操作步骤
1. 实现 `src/hooks/useAudioRecorder.js`：
   - 使用 `MediaRecorder` 管理录音，暴露 `start`、`pause`、`resume`、`stop`、`reset` 方法；
   - 维护 `isRecording`、`isPaused`、`hasRecording`、`audioBlob`、`audioUrl` 状态；
   - 捕获浏览器权限错误并在 `error` 状态中返回给 UI。
2. 编写 `src/components/RecorderControls.jsx`，渲染开始/暂停/继续/结束按钮，并根据 props 控制禁用状态，满足“可暂停、禁重录”的 Rubric 要求。
3. 在 `src/utils/transcription.js` 中提供 `transcribeAudio` 占位实现：
   - 模拟异步延迟；
   - 返回固定格式的文本，后续可替换为 Whisper 或 Transformers.js。
4. 更新 `src/services/answerApi.js`，添加 `listAnswers`、`createAnswer`、`updateAnswer` 等函数，为保存候选人作答提供接口。
5. 在 `src/pages/take-interview/TakeInterviewLanding.jsx` 中实现完整流程：
   - 使用 `useParams` 读取 `applicantId`，调用 `getApplicant` 校验邀请有效性；
   - 并行请求 `listQuestions`、`listAnswers`，将历史记录映射为 `answers` 状态；
   - 根据答题进度控制步骤枚举（`WELCOME` → `QUESTION` → `COMPLETE`），禁止回退；
   - 提交答案时调用 `transcribeAudio` 获取文本，再根据是否已有 `answer.id` 选择 `createAnswer` 或 `updateAnswer`；
   - 当最后一题完成后调用 `updateApplicant` 将 `interview_status` 改为 `Completed`。
6. 在问题视图中嵌入 `RecorderControls`，仅当存在录音文件时允许进入“Submit answer”，按钮文案随 `saving` 状态变化。
7. 对加载失败或题目为空的情况输出友好错误提示，符合 `/rules/frontend.md` 对错误路径的要求。

## 交付结果
- 候选人访问邀请链接时可按步骤录音、转写并保存文本答案，全程只允许向前推进。
- 面试完成后页面切换到 Thank you 视图，同时更新候选人状态为 Completed。
