// 候选人 AI 总结侧边栏，展示生成的洞察并提供刷新与关闭操作。
export default function ApplicantSummaryPanel({ applicant, summary, loading, error, onClose, onGenerate }) {
  // 没有传入候选人时直接不渲染，避免多余开销。
  if (!applicant) return null;

  return (
    <aside className="rounded-xl border border-indigo-100 bg-indigo-50 p-6 shadow-inner">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-indigo-700">
            AI Insights for {applicant.firstname} {applicant.surname}
          </h3>
          <p className="text-sm text-indigo-600">
            Summaries leverage your configured AI provider (placeholder until API key is supplied).
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Generating...' : 'Refresh Summary'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-md border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-500"
          >
            Close
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
        {/* 根据错误、加载和结果三种状态分别渲染内容 */}
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {!error && summary && (
          <pre className="whitespace-pre-wrap text-sm text-slate-700">{summary}</pre>
        )}
        {!error && !summary && !loading && (
          <p className="text-sm text-slate-600">Trigger the AI summary to review candidate highlights.</p>
        )}
      </div>
    </aside>
  );
}
