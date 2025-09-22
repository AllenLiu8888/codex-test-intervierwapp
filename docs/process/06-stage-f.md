# 阶段 F：Advanced GenAI 功能

## 操作步骤
1. 在 `src/services/genAiApi.js` 定义 `generateApplicantSummary`：
   - 读取 `import.meta.env.VITE_LLM_API_KEY`，当缺少密钥时返回占位提示；
   - 模拟网络延迟并组合候选人信息与答案摘要，待真实 LLM 接入后替换。
2. 在 `src/components/ApplicantSummaryPanel.jsx` 构建侧边栏组件，展示候选人姓名、生成状态、错误信息及刷新/关闭按钮。
3. 在 `src/pages/applicants/ApplicantsPage.jsx` 中：
   - 使用 `useState` 维护当前选中候选人、摘要文本、加载与错误状态；
   - 在 `runSummary` 回调内先调用 `listAnswers(applicant.id)` 拉取最新答案，再调用 `generateApplicantSummary`；
   - 将返回内容交给 `ApplicantSummaryPanel`，并在主列表侧展示。
4. 在列表 Action 区域加入 “AI Summary” 按钮，点击后触发上述流程，若失败则在侧边栏显示错误消息。
5. 在 `README.md` 与 `docs/how_to_run.md` 中补充环境变量 `VITE_LLM_API_KEY` 的配置说明，提醒需要自行填入真实密钥。

## 交付结果
- HR 可在候选人列表中一键生成 AI 总结，界面展示加载、错误、成功三种状态。
- 未提供密钥时会得到占位提示，符合部署规则“不提交真实密钥”的要求。
