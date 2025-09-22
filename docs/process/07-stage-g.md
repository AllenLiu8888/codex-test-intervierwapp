# 阶段 G：验收与交付

## 操作步骤
1. 依据 `docs/qa_checklist.md` 对照 Rubric 检查：
   - 核实 Interview / Question / Applicant CRUD 是否全流程可用；
   - 确认候选人录音转写、禁回退、完成状态更新逻辑；
   - 检查 UI 一致性与导航是否覆盖所有功能。
2. 运行 `npm install` 以验证依赖完整性，并记录沙箱环境因 403 导致的安装限制。
3. 更新 `README.md`：
   - 标注本地开发端口 5176、环境变量配置示例、JWT 使用说明；
   - 说明 GenAI 功能使用占位符并需自备 `VITE_LLM_API_KEY`。
4. 在 `docs/how_to_run.md` 中补充示例 Interview 的构建方法与录音转写两种实现路径。
5. 最终检查 `git status` 确认工作区干净后提交代码，并在 PR 描述里总结关键改动与测试情况。

## 交付结果
- 项目文档、QA 清单与 README 完整，具备“无人干预”复现能力。
- 构建与运行步骤明晰，已记录外部网络受限导致的安装失败情况，方便评分时参考。
