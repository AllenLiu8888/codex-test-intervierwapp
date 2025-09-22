# 阶段 A：规则与文档落地

## 操作步骤
1. 在 `rules/README.md` 中写明核心工程原则（SOLID / DRY / KISS / 可读性）与自检清单，确保后续开发有统一标准。
2. 在 `rules/frontend.md` 记录前端架构分层、异步状态三态、录音转写等 Rubric 要求，作为页面和组件实现的约束。
3. 在 `rules/deployment.md` 约定只能使用现有 REST API、环境变量 `VITE_API_BASE_URL` 和 `VITE_LLM_API_KEY` 的读取方式。
4. 依据 PRD 新建文档目录 `docs/`，分别在 `docs/prd.md`、`docs/api.md`、`docs/how_to_run.md`、`docs/qa_checklist.md`、`docs/README.md`、`docs/build_plan.md` 写入验收条目、API 示例、运行步骤与质检清单。
5. 建立开发提示 `DEV_PLAN.md`，写入阶段性自用 Prompt 与完成总结，方便之后跟踪每个阶段的 TODO。
6. 预先创建前端目录骨架（如 `src/components`、`src/pages/interviews`、`src/services` 等），确保文件布局符合 `/rules/frontend.md` 的分层要求。

## 交付结果
- 规则与文档文件齐备，仓库根目录下运行 `ls rules` 与 `ls docs` 可看到上述 Markdown 文件。
- `DEV_PLAN.md` 已包含阶段 A 的 Prompt 与完成记录，为后续阶段提供操作日志。
